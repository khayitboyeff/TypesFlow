
import asyncio
import logging
import os
import secrets
import sqlite3
from datetime import datetime, timedelta, timezone
from pathlib import Path

from dotenv import load_dotenv
from aiogram import Bot, Dispatcher, F
from aiogram.filters import CommandStart, Command
from aiogram.types import (
    Message,
    CallbackQuery,
    InlineKeyboardMarkup,
    InlineKeyboardButton,
    ReplyKeyboardMarkup,
    KeyboardButton,
)
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode

load_dotenv()
logging.basicConfig(level=logging.INFO)

BOT_TOKEN = os.getenv("BOT_TOKEN", "").strip()
ADMIN_IDS = {
    int(x.strip())
    for x in os.getenv("ADMIN_IDS", "").split(",")
    if x.strip().isdigit()
}
CARD_NUMBER = os.getenv("CARD_NUMBER", "").strip()
CARD_OWNER = os.getenv("CARD_OWNER", "").strip()
DB_PATH = os.getenv("DB_PATH", "payments.sqlite3")

if not BOT_TOKEN:
    raise RuntimeError("BOT_TOKEN .env faylida kiritilmagan.")

if not CARD_NUMBER or not CARD_OWNER:
    raise RuntimeError("CARD_NUMBER va CARD_OWNER ni .env faylida kiriting.")

if not ADMIN_IDS:
    raise RuntimeError("ADMIN_IDS ga Telegram raqamli ID'ingizni kiriting.")


# Tarif narxlari va amal qilish muddati
PLANS = {
    "pro_1": {
        "name": "Pro — 1 oy",
        "amount": 15000,
        "days": 30,
    },
    "pro_6": {
        "name": "Pro — 6 oy",
        "amount": 60000,
        "days": 180,
    },
    "ultra_1": {
        "name": "Ultra — 1 oy",
        "amount": 25000,
        "days": 30,
    },
    "ultra_6": {
        "name": "Ultra — 6 oy",
        "amount": 120000,
        "days": 180,
    },
}


def get_db():
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    return con


def init_db():
    with get_db() as con:
        con.execute("""
            CREATE TABLE IF NOT EXISTS orders (
                id TEXT PRIMARY KEY,
                tg_user_id INTEGER NOT NULL,
                username TEXT,
                plan_key TEXT NOT NULL,
                amount INTEGER NOT NULL,
                status TEXT NOT NULL DEFAULT 'pending',
                receipt_file_id TEXT,
                created_at TEXT NOT NULL,
                reviewed_at TEXT,
                reviewed_by INTEGER,
                reject_reason TEXT
            )
        """)

        con.execute("""
            CREATE TABLE IF NOT EXISTS subscriptions (
                tg_user_id INTEGER PRIMARY KEY,
                plan_key TEXT NOT NULL,
                expires_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
        """)

        con.execute("""
            CREATE TABLE IF NOT EXISTS audit_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_id TEXT NOT NULL,
                action TEXT NOT NULL,
                admin_id INTEGER NOT NULL,
                at TEXT NOT NULL,
                note TEXT
            )
        """)


def money(amount):
    return f"{amount:,}".replace(",", " ") + " so'm"


def main_menu():
    return ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text="💳 Obuna sotib olish")],
            [
                KeyboardButton(text="👤 Mening obunam"),
                KeyboardButton(text="🆘 Yordam"),
            ],
        ],
        resize_keyboard=True,
    )


def plans_keyboard():
    rows = []

    for key, plan in PLANS.items():
        rows.append([
            InlineKeyboardButton(
                text=f"{plan['name']} — {money(plan['amount'])}",
                callback_data=f"plan:{key}",
            )
        ])

    return InlineKeyboardMarkup(inline_keyboard=rows)


def review_keyboard(order_id):
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="✅ Tasdiqlash",
                    callback_data=f"approve:{order_id}",
                ),
                InlineKeyboardButton(
                    text="❌ Rad etish",
                    callback_data=f"reject:{order_id}",
                ),
            ]
        ]
    )


bot = Bot(
    BOT_TOKEN,
    default=DefaultBotProperties(parse_mode=ParseMode.HTML),
)
dp = Dispatcher()


@dp.message(CommandStart())
async def start(message: Message):
    await message.answer(
        "👋 <b>TypeFlow obuna botiga xush kelibsiz!</b>\n\n"
        "Tarifni tanlang, karta orqali to'lov qiling va chekni yuboring.\n"
        "To'lov tekshirilgandan keyin obuna faollashtiriladi.",
        reply_markup=main_menu(),
    )


@dp.message(Command("help"))
@dp.message(F.text == "🆘 Yordam")
async def help_command(message: Message):
    await message.answer(
        "📌 <b>To'lov qilish tartibi</b>\n\n"
        "1. Obuna sotib olish tugmasini bosing.\n"
        "2. Tarifni tanlang.\n"
        "3. Ko'rsatilgan summani kartaga o'tkazing.\n"
        "4. Chek rasmini yoki faylini yuboring.\n"
        "5. Admin haqiqiy to'lovni tekshiradi.\n\n"
        "⚠️ Chek yuborilishi to'lov tasdiqlandi degani emas."
    )


@dp.message(F.text == "💳 Obuna sotib olish")
async def buy_subscription(message: Message):
    await message.answer(
        "Quyidagi tariflardan birini tanlang:",
        reply_markup=plans_keyboard(),
    )


@dp.callback_query(F.data.startswith("plan:"))
async def select_plan(call: CallbackQuery):
    plan_key = call.data.split(":", 1)[1]
    plan = PLANS.get(plan_key)

    if not plan:
        await call.answer("Tarif topilmadi.", show_alert=True)
        return

    order_id = secrets.token_hex(4).upper()
    created_at = datetime.now(timezone.utc).isoformat()

    with get_db() as con:
        con.execute(
            """
            INSERT INTO orders
            (id, tg_user_id, username, plan_key, amount, status, created_at)
            VALUES (?, ?, ?, ?, ?, 'pending', ?)
            """,
            (
                order_id,
                call.from_user.id,
                call.from_user.username,
                plan_key,
                plan["amount"],
                created_at,
            ),
        )

    await call.message.answer(
        f"🧾 <b>Buyurtma: #{order_id}</b>\n\n"
        f"Tarif: <b>{plan['name']}</b>\n"
        f"To'lov summasi: <b>{money(plan['amount'])}</b>\n\n"
        f"💳 <b>Karta raqami:</b>\n"
        f"<code>{CARD_NUMBER}</code>\n\n"
        f"👤 <b>Karta egasi:</b>\n"
        f"{CARD_OWNER}\n\n"
        "To'lovni aynan ko'rsatilgan summada amalga oshiring. "
        "Keyin chek rasmini yoki faylini shu botga yuboring.\n\n"
        "🔒 To'lov admin tomonidan tekshiriladi. "
        "Tasdiqlanmaguncha tarif faollashtirilmaydi."
    )

    await call.answer()


async def save_receipt(message: Message, file_id: str):
    with get_db() as con:
        order = con.execute(
            """
            SELECT * FROM orders
            WHERE tg_user_id = ?
              AND status = 'pending'
              AND receipt_file_id IS NULL
            ORDER BY created_at DESC
            LIMIT 1
            """,
            (message.from_user.id,),
        ).fetchone()

        if not order:
            return None

        con.execute(
            "UPDATE orders SET receipt_file_id = ? WHERE id = ?",
            (file_id, order["id"]),
        )

    return order


async def notify_admins(order, file_id, is_photo=True):
    plan = PLANS[order["plan_key"]]

    caption = (
        "🧾 <b>Yangi to'lov cheki</b>\n\n"
        f"Buyurtma: <code>#{order['id']}</code>\n"
        f"Telegram ID: <code>{order['tg_user_id']}</code>\n"
        f"Username: @{order['username'] or 'mavjud emas'}\n"
        f"Tarif: {plan['name']}\n"
        f"Summa: {money(order['amount'])}\n\n"
        "Bank ilovasidagi haqiqiy kirim bilan solishtiring."
    )

    for admin_id in ADMIN_IDS:
        try:
            if is_photo:
                await bot.send_photo(
                    admin_id,
                    file_id,
                    caption=caption,
                    reply_markup=review_keyboard(order["id"]),
                )
            else:
                await bot.send_document(
                    admin_id,
                    file_id,
                    caption=caption,
                    reply_markup=review_keyboard(order["id"]),
                )
        except Exception:
            logging.exception("Adminga chek yuborilmadi: %s", admin_id)


@dp.message(F.photo)
async def receive_photo(message: Message):
    order = await save_receipt(
        message,
        message.photo[-1].file_id,
    )

    if not order:
        await message.answer(
            "Chek yuborishdan oldin tarif tanlab, buyurtma yarating. "
            "Yoki bu buyurtmaga chek allaqachon yuborilgan."
        )
        return

    await notify_admins(
        order,
        message.photo[-1].file_id,
        is_photo=True,
    )

    await message.answer(
        f"✅ Chek qabul qilindi.\n"
        f"Buyurtma: <code>#{order['id']}</code>\n\n"
        "Admin to'lovni tekshirgach, sizga xabar yuboriladi."
    )


@dp.message(F.document)
async def receive_document(message: Message):
    order = await save_receipt(
        message,
        message.document.file_id,
    )

    if not order:
        await message.answer(
            "Avval tarif tanlab buyurtma yarating. "
            "Yoki bu buyurtmaga chek allaqachon yuborilgan."
        )
        return

    await notify_admins(
        order,
        message.document.file_id,
        is_photo=False,
    )

    await message.answer(
        f"✅ Chek fayli qabul qilindi.\n"
        f"Buyurtma: <code>#{order['id']}</code>\n\n"
        "Admin tekshiruvini kuting."
    )


@dp.callback_query(F.data.startswith("approve:"))
async def approve_payment(call: CallbackQuery):
    if call.from_user.id not in ADMIN_IDS:
        await call.answer(
            "Sizda admin huquqi yo'q.",
            show_alert=True,
        )
        return

    order_id = call.data.split(":", 1)[1]
    now = datetime.now(timezone.utc)

    with get_db() as con:
        order = con.execute(
            "SELECT * FROM orders WHERE id = ?",
            (order_id,),
        ).fetchone()

        if (
            not order
            or order["status"] != "pending"
            or not order["receipt_file_id"]
        ):
            await call.answer(
                "Buyurtma topilmadi, chek yo'q yoki allaqachon ko'rib chiqilgan.",
                show_alert=True,
            )
            return

        existing = con.execute(
            "SELECT * FROM subscriptions WHERE tg_user_id = ?",
            (order["tg_user_id"],),
        ).fetchone()

        start_from = now

        if existing:
            try:
                old_expiry = datetime.fromisoformat(
                    existing["expires_at"]
                )

                if old_expiry.tzinfo is None:
                    old_expiry = old_expiry.replace(
                        tzinfo=timezone.utc
                    )

                if old_expiry > now:
                    start_from = old_expiry
            except ValueError:
                start_from = now

        expires_at = (
            start_from
            + timedelta(days=PLANS[order["plan_key"]]["days"])
        ).isoformat()

        # Bir buyurtma faqat bir marta tasdiqlanadi.
        updated = con.execute(
            """
            UPDATE orders
            SET status = 'approved',
                reviewed_at = ?,
                reviewed_by = ?
            WHERE id = ? AND status = 'pending'
            """,
            (
                now.isoformat(),
                call.from_user.id,
                order_id,
            ),
        )

        if updated.rowcount != 1:
            await call.answer(
                "Buyurtma allaqachon ko'rib chiqilgan.",
                show_alert=True,
            )
            return

        con.execute(
            """
            INSERT INTO subscriptions
            (tg_user_id, plan_key, expires_at, updated_at)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(tg_user_id)
            DO UPDATE SET
                plan_key = excluded.plan_key,
                expires_at = excluded.expires_at,
                updated_at = excluded.updated_at
            """,
            (
                order["tg_user_id"],
                order["plan_key"],
                expires_at,
                now.isoformat(),
            ),
        )

        con.execute(
            """
            INSERT INTO audit_log
            (order_id, action, admin_id, at, note)
            VALUES (?, 'approved', ?, ?, ?)
            """,
            (
                order_id,
                call.from_user.id,
                now.isoformat(),
                "Admin tomonidan tasdiqlandi",
            ),
        )

    plan = PLANS[order["plan_key"]]

    try:
        await bot.send_message(
            order["tg_user_id"],
            "🎉 <b>To'lov tasdiqlandi!</b>\n\n"
            f"Tarif: <b>{plan['name']}</b>\n"
            f"Amal qilish muddati: <code>{expires_at[:10]}</code>\n"
            f"Buyurtma: <code>#{order_id}</code>",
        )
    except Exception:
        logging.exception("Foydalanuvchiga xabar yuborilmadi")

    await call.message.edit_reply_markup(
        reply_markup=None
    )
    await call.answer("To'lov tasdiqlandi.")
    await call.message.answer(
        f"✅ #{order_id} tasdiqlandi.\n"
        "Obuna bot bazasida faollashtirildi."
    )


@dp.callback_query(F.data.startswith("reject:"))
async def reject_payment(call: CallbackQuery):
    if call.from_user.id not in ADMIN_IDS:
        await call.answer(
            "Sizda admin huquqi yo'q.",
            show_alert=True,
        )
        return

    order_id = call.data.split(":", 1)[1]
    now = datetime.now(timezone.utc).isoformat()

    with get_db() as con:
        order = con.execute(
            "SELECT * FROM orders WHERE id = ?",
            (order_id,),
        ).fetchone()

        if not order or order["status"] != "pending":
            await call.answer(
                "Buyurtma topilmadi yoki ko'rib chiqilgan.",
                show_alert=True,
            )
            return

        con.execute(
            """
            UPDATE orders
            SET status = 'rejected',
                reviewed_at = ?,
                reviewed_by = ?,
                reject_reason = ?
            WHERE id = ? AND status = 'pending'
            """,
            (
                now,
                call.from_user.id,
                "Admin tomonidan rad etildi",
                order_id,
            ),
        )

        con.execute(
            """
            INSERT INTO audit_log
            (order_id, action, admin_id, at, note)
            VALUES (?, 'rejected', ?, ?, ?)
            """,
            (
                order_id,
                call.from_user.id,
                now,
                "Admin tomonidan rad etildi",
            ),
        )

    try:
        await bot.send_message(
            order["tg_user_id"],
            "❌ <b>To'lov cheki tasdiqlanmadi.</b>\n\n"
            f"Buyurtma: <code>#{order_id}</code>\n"
            "Agar pul haqiqatan o'tgan bo'lsa, admin bilan bog'laning.",
        )
    except Exception:
        logging.exception("Foydalanuvchiga xabar yuborilmadi")

    await call.message.edit_reply_markup(
        reply_markup=None
    )
    await call.answer("Chek rad etildi.")
    await call.message.answer(
        f"❌ #{order_id} rad etildi."
    )


@dp.message(F.text == "👤 Mening obunam")
async def my_subscription(message: Message):
    with get_db() as con:
        sub = con.execute(
            "SELECT * FROM subscriptions WHERE tg_user_id = ?",
            (message.from_user.id,),
        ).fetchone()

        orders = con.execute(
            """
            SELECT id, status, created_at
            FROM orders
            WHERE tg_user_id = ?
            ORDER BY created_at DESC
            LIMIT 5
            """,
            (message.from_user.id,),
        ).fetchall()

    if sub:
        expiry = datetime.fromisoformat(sub["expires_at"])
        now = datetime.now(timezone.utc)

        if expiry.tzinfo is None:
            expiry = expiry.replace(tzinfo=timezone.utc)

        if expiry > now:
            status = "Faol"
        else:
            status = "Muddati tugagan"

        await message.answer(
            "👤 <b>Mening obunam</b>\n\n"
            f"Tarif: <b>{PLANS[sub['plan_key']]['name']}</b>\n"
            f"Holat: <b>{status}</b>\n"
            f"Tugash sanasi: <code>{expiry.date()}</code>"
        )
    else:
        await message.answer(
            "Hozircha tasdiqlangan obunangiz yo'q."
        )

    if orders:
        lines = ["<b>Oxirgi buyurtmalaringiz:</b>"]

        for order in orders:
            lines.append(
                f"• #{order['id']} — {order['status']} "
                f"({order['created_at'][:10]})"
            )

        await message.answer("\n".join(lines))


@dp.message(Command("pending"))
async def pending_orders(message: Message):
    if message.from_user.id not in ADMIN_IDS:
        return

    with get_db() as con:
        orders = con.execute(
            """
            SELECT * FROM orders
            WHERE status = 'pending'
            ORDER BY created_at ASC
            LIMIT 30
            """
        ).fetchall()

    if not orders:
        await message.answer(
            "Kutilayotgan buyurtmalar yo'q."
        )
        return

    for order in orders:
        plan = PLANS[order["plan_key"]]

        text = (
            f"🧾 <b>Buyurtma #{order['id']}</b>\n"
            f"Telegram ID: <code>{order['tg_user_id']}</code>\n"
            f"Tarif: {plan['name']}\n"
            f"Summa: {money(order['amount'])}\n"
            f"Chek: {'bor' if order['receipt_file_id'] else 'yo‘q'}\n"
            f"Holat: {order['status']}"
        )

        await message.answer(
            text,
            reply_markup=(
                review_keyboard(order["id"])
                if order["receipt_file_id"]
                else None
            ),
        )


async def main():
    init_db()
    logging.info("TypeFlow to'lov boti ishga tushmoqda...")
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
