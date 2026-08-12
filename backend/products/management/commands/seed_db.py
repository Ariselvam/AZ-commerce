from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from products.models import Category, Product
from reviews.models import Review
import decimal

User = get_user_model()

class Command(BaseCommand):
    help = "Seeds the database with initial categories, products, and an admin user."

    def handle(self, *args, **options):
        self.stdout.write("Seeding database...")

        # 1. Create Admin User
        self.stdout.write("Creating admin user...")
        admin_email = "admin@azcommerce.com"
        admin_username = "admin"
        if not User.objects.filter(username=admin_username).exists():
            admin_user = User.objects.create_superuser(
                username=admin_username,
                email=admin_email,
                password="adminpass",
                first_name="AZ",
                last_name="Administrator"
            )
            admin_user.is_admin_user = True
            admin_user.save()
            self.stdout.write(self.style.SUCCESS("Superuser created successfully: admin / adminpass"))
        else:
            self.stdout.write("Admin user already exists.")

        # 2. Create standard customer for testing
        customer_username = "customer"
        if not User.objects.filter(username=customer_username).exists():
            customer_user = User.objects.create_user(
                username=customer_username,
                email="customer@gmail.com",
                password="customerpass",
                first_name="Rahul",
                last_name="Sharma",
                phone="9876543210",
                address="123, Park Street",
                city="Kolkata",
                state="West Bengal",
                pincode="700016"
            )
            self.stdout.write(self.style.SUCCESS("Standard user created successfully: customer / customerpass"))

        # Clear existing categories/products to allow clean updates
        self.stdout.write("Clearing existing catalog items...")
        Product.objects.all().delete()
        Category.objects.all().delete()

        # 3. Define Categories
        categories_data = [
            {
                "name": "Electronics",
                "image_url": "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&auto=format&fit=crop&q=60",
                "description": "High performance laptops, smartphones, and mobile accessories."
            },
            {
                "name": "Fashion",
                "image_url": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format&fit=crop&q=60",
                "description": "Modern style outfits, premium cotton t-shirts, jackets, and winter coats."
            },
            {
                "name": "Shoes",
                "image_url": "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&auto=format&fit=crop&q=60",
                "description": "Sports sneakers, gym runners, and premium casual leather footwear."
            },
            {
                "name": "Watches",
                "image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60",
                "description": "Sleek fitness smartwatches and classical dial chronograph watches."
            },
            {
                "name": "Accessories",
                "image_url": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60",
                "description": "Utility storage school backpacks, office satchels, and leather wallets."
            },
            {
                "name": "Beauty & Personal Care",
                "image_url": "https://images.unsplash.com/photo-1608248597481-496100c8c836?w=500&auto=format&fit=crop&q=60",
                "description": "Premium cosmetic skincare, hydration moisturizers, and French fragrances."
            },
            {
                "name": "Home & Kitchen",
                "image_url": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&auto=format&fit=crop&q=60",
                "description": "Automated espresso brewers and non-stick ceramic skillet dining cookwares."
            }
        ]

        categories = {}
        for cat_data in categories_data:
            cat = Category.objects.create(**cat_data)
            categories[cat.name] = cat
            self.stdout.write(f"Created category: {cat.name}")

        # 4. Define Products
        products_data = [
            # Electronics
            {
                "category": categories["Electronics"],
                "name": "ApexBook Pro 15",
                "image_url": "https://images.unsplash.com/photo-1496181130204-755241544e35?w=600&auto=format&fit=crop&q=80",
                "image_url_2": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80",
                "image_url_3": "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=600&auto=format&fit=crop&q=80",
                "description": "Power-packed 15.6 inch laptop with Octa-Core processor, 16GB RAM, and 512GB SSD. Perfect for coding, designing, and gaming. Features a clean metal body and standard backlit keyboard.",
                "price": decimal.Decimal("64999.00"),
                "discount_price": decimal.Decimal("59999.00"),
                "stock": 15,
                "rating": decimal.Decimal("4.50"),
                "num_reviews": 1
            },
            {
                "category": categories["Electronics"],
                "name": "Z-Phone Neon Plus",
                "image_url": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80",
                "image_url_2": "https://images.unsplash.com/photo-1565849906660-afc86cd09929?w=600&auto=format&fit=crop&q=80",
                "description": "Stunning 6.7 inch Super AMOLED display smartphone with 108MP triple camera setup and 5000mAh battery. Supports ultra fast charging. Sleek cyan color back panel.",
                "price": decimal.Decimal("24999.00"),
                "discount_price": decimal.Decimal("21999.00"),
                "stock": 25,
                "rating": decimal.Decimal("4.20"),
                "num_reviews": 0
            },
            {
                "category": categories["Electronics"],
                "name": "Acoustic-X ANC Headphones",
                "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
                "description": "Premium over-ear wireless headphones with active noise cancellation, smart touch gesture controls, and 40-hour long playback stamina.",
                "price": decimal.Decimal("8999.00"),
                "discount_price": decimal.Decimal("6999.00"),
                "stock": 30,
                "rating": decimal.Decimal("4.60"),
                "num_reviews": 0
            },
            # Fashion
            {
                "category": categories["Fashion"],
                "name": "Classic Denim Jacket",
                "image_url": "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80",
                "description": "Authentic denim jacket crafted from 100% durable cotton canvas. Standard fit with brass front buttons. Classic blue indigo wash.",
                "price": decimal.Decimal("2999.00"),
                "discount_price": decimal.Decimal("2499.00"),
                "stock": 50,
                "rating": decimal.Decimal("4.10"),
                "num_reviews": 0
            },
            {
                "category": categories["Fashion"],
                "name": "Luxe Cotton Slim Fit Tee",
                "image_url": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
                "description": "Supersoft organic cotton crew neck t-shirt. Tailored comfort fit, breathable weave pattern, and color-fade resistant treatment.",
                "price": decimal.Decimal("999.00"),
                "discount_price": decimal.Decimal("799.00"),
                "stock": 100,
                "rating": decimal.Decimal("4.30"),
                "num_reviews": 0
            },
            # Shoes
            {
                "category": categories["Shoes"],
                "name": "Run-Fast Swift Sneakers",
                "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
                "description": "Lightweight breathable mesh athletic shoes featuring responsive shock-absorbing cushioning soles. Outstanding grip for outdoor road runs.",
                "price": decimal.Decimal("4999.00"),
                "discount_price": decimal.Decimal("3499.00"),
                "stock": 40,
                "rating": decimal.Decimal("4.70"),
                "num_reviews": 0
            },
            # Watches
            {
                "category": categories["Watches"],
                "name": "Active Fit Watch 3",
                "image_url": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80",
                "description": "Advanced health tracking smartwatch featuring dynamic heart rate monitoring, SPO2 tracking, built-in GPS, and comprehensive workout modes.",
                "price": decimal.Decimal("5999.00"),
                "discount_price": decimal.Decimal("4999.00"),
                "stock": 35,
                "rating": decimal.Decimal("4.40"),
                "num_reviews": 0
            },
            # Accessories
            {
                "category": categories["Accessories"],
                "name": "Nomad Canvas Backpack",
                "image_url": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
                "description": "Sturdy weather-resistant utility backpack featuring a dedicated padded compartment for 15.6 inch laptops, dual water bottle pockets, and soft padded shoulder straps.",
                "price": decimal.Decimal("3499.00"),
                "discount_price": decimal.Decimal("2499.00"),
                "stock": 45,
                "rating": decimal.Decimal("4.50"),
                "num_reviews": 0
            },
            # Beauty
            {
                "category": categories["Beauty & Personal Care"],
                "name": "Oasis Hydrating Skin Cream",
                "image_url": "https://images.unsplash.com/photo-1608248597481-496100c8c836?w=600&auto=format&fit=crop&q=80",
                "description": "Deep moisturizing hydration skin gel. Enriched with natural aloe extract, vitamin E, and hyaluronic acid for a refreshing face glow.",
                "price": decimal.Decimal("1299.00"),
                "discount_price": decimal.Decimal("999.00"),
                "stock": 60,
                "rating": decimal.Decimal("4.20"),
                "num_reviews": 0
            },
            # Home & Kitchen
            {
                "category": categories["Home & Kitchen"],
                "name": "Barista Drip Coffee Maker",
                "image_url": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80",
                "description": "User-friendly programmable automatic coffee machine featuring a 12-cup glass carafe, warm heating plate, and custom brew strength selectors.",
                "price": decimal.Decimal("4499.00"),
                "discount_price": decimal.Decimal("3999.00"),
                "stock": 20,
                "rating": decimal.Decimal("4.40"),
                "num_reviews": 0
            }
        ]

        for prod_data in products_data:
            prod = Product.objects.create(**prod_data)
            self.stdout.write(f"Created product: {prod.name}")

        # 5. Create a sample review
        # Fetch the admin user we created or create a dummy user for the review
        u = User.objects.get(username=admin_username)
        p = Product.objects.get(name="ApexBook Pro 15")
        Review.objects.create(
            product=p,
            user=u,
            rating=5,
            comment="Unmatched coding machine! Extremely fast compile rates, great screen color calibration, and very comfortable keyboard travel."
        )
        self.stdout.write("Created sample product reviews.")

        self.stdout.write(self.style.SUCCESS("Database seeding completed successfully!"))
