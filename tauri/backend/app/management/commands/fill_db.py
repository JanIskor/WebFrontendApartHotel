from django.conf import settings
from django.core.management.base import BaseCommand
from minio import Minio

from .utils import *
from app.models import *


def add_users():
    User.objects.create_user("user", "user@user.com", "1234", first_name="user", last_name="user")
    User.objects.create_superuser("root", "root@root.com", "1234", first_name="root", last_name="root")

    for i in range(1, 10):
        User.objects.create_user(f"user{i}", f"user{i}@user.com", "1234", first_name=f"user{i}", last_name=f"user{i}")
        User.objects.create_superuser(f"root{i}", f"root{i}@root.com", "1234", first_name=f"user{i}", last_name=f"user{i}")


def add_apartments():
    Apartment.objects.create(
        name="GRIFFIN SUITE",
        description="Полулюкс, 1 большая двуспальная кровать, Диван-кровать, Мини-холодильник, 59 кв.м., Гостиная/зона отдыха, Беспроводной доступ в Интернет (платно), Проводной доступ в Интернет (платно), Кофеварка/чайник",
        price=1000,
        image="1.png"
    )

    Apartment.objects.create(
        name="STUDIO SUITE",
        description="Люкс-студио, 1 кровать размера 'king-size', диван-кровать, мини-холодильник, 756 кв. футов/68 кв.м., гостиная/гостиная, обеденная зона, беспроводной интернет, за плату, проводной интернет, за плату, кофеварка/чайник",
        price=8000,
        image="2.png"
    )

    Apartment.objects.create(
        name="JUNIOR SUITE",
        description="Представительский большой номер для гостей, 1 кровать размера 'king-size', мини-холодильник, 525 кв. футов/47 кв.м., беспроводной интернет, за плату, проводной интернет, за плату, кофеварка/чайник",
        price=2000,
        image="3.png"
    )

    Apartment.objects.create(
        name="Парковка в апарт-отеле",
        description="Паркинг расположен на закрытой территории гостиницы и оснащен видеонаблюдением, рассчитан на 150 мест, включая места не только для легковых автомобилей, а также для крупногабаритного транспорта, например,  туристических автобусов.",
        price=5000,
        image="4.png"
    )

    Apartment.objects.create(
        name="Завтрак в номе",
        description="Континентальный завтрак предполагает порционное питание, в которое обычно входят жареные яйца, бекон либо отварные сосиски, тосты, круассаны, овощи, чай или кофе – на выбор. В этом формате ассортимент уже.",
        price=12000,
        image="5.png"
    )

    Apartment.objects.create(
        name="SPA процедуры",
        description="Комплексные расслабляющие процедуры, направленные на оздоровление, расслабление и лечение организма человека, его перезагрузку и профилактику многих заболеваний и проблем. Эффект после спа оказывается как на духовном, так и на физическом уровне.",
        price=3500,
        image="6.png"
    )

    client = Minio(settings.MINIO_ENDPOINT,
                   settings.MINIO_ACCESS_KEY,
                   settings.MINIO_SECRET_KEY,
                   secure=settings.MINIO_USE_HTTPS)

    for i in range(1, 7):
        client.fput_object(settings.MINIO_MEDIA_FILES_BUCKET, f'{i}.png', f"app/static/images/{i}.png")

    client.fput_object(settings.MINIO_MEDIA_FILES_BUCKET, 'default.png', "app/static/images/default.png")


def add_applications():
    users = User.objects.filter(is_staff=False)
    moderators = User.objects.filter(is_staff=True)
    apartments = Apartment.objects.all()

    for _ in range(30):
        status = random.randint(2, 5)
        owner = random.choice(users)
        add_application(status, apartments, owner, moderators)

    add_application(1, apartments, users[0], moderators)
    add_application(2, apartments, users[0], moderators)
    add_application(3, apartments, users[0], moderators)
    add_application(4, apartments, users[0], moderators)
    add_application(5, apartments, users[0], moderators)

    for _ in range(10):
        status = random.randint(2, 5)
        add_application(status, apartments, users[0], moderators)


def add_application(status, apartments, owner, moderators):
    application = Application.objects.create()
    application.status = status

    if status in [3, 4]:
        application.moderator = random.choice(moderators)
        application.date_complete = random_date()
        application.date_formation = application.date_complete - random_timedelta()
        application.date_created = application.date_formation - random_timedelta()
    else:
        application.date_formation = random_date()
        application.date_created = application.date_formation - random_timedelta()

    if status == 3:
        application.total_price = 1000 * random.randint(1, 30)

    application.start_date = random_date()
    application.final_date = application.start_date + timedelta(random.uniform(0, 1) * 31)

    application.owner = owner

    for apartment in random.sample(list(apartments), 3):
        item = ApartmentApplication(
            application=application,
            apartment=apartment,
            wishes="Пожелания"
        )
        item.save()

    application.save()


class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        add_users()
        add_apartments()
        add_applications()
