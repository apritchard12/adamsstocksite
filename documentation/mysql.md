# MySQL Setup on Ubuntu (GCP)

## 1. Install MySQL Server
```bash
sudo apt update
sudo apt install mysql-server -y
```

## 2. Secure Installation
Run this command to set your root password and remove insecure defaults:
```bash
sudo mysql_secure_installation
```
*(Follow the prompts: Yes to password plugin (optional), set root password, Yes to remove anonymous users, Yes to disallow root login remotely, Yes to remove test database, Yes to reload tables.)*

## 3. Create Database & User
Log in to MySQL:
```bash
sudo mysql -u root -p
```

Run the following SQL commands:
```sql
CREATE DATABASE IF NOT EXISTS stock_news;
USE stock_news;

CREATE TABLE articles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  summary TEXT,
  content LONGTEXT,
  category VARCHAR(50),
  related_tickers VARCHAR(255),
  author VARCHAR(100),
  image_url VARCHAR(255),
  active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create a user for the app (Replace 'password' with a strong password)
CREATE USER 'stock_user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON stock_news.* TO 'stock_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## 4. Update .env file
Update your application's `.env` file with the new credentials:
```bash
DB_HOST=localhost
DB_USER=stock_user
DB_PASSWORD=password
DB_NAME=stock_news
```

---

# Schema Reference

```sql
CREATE DATABASE IF NOT EXISTS stock_news;
USE stock_news;


CREATE TABLE articles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  summary TEXT,
  content LONGTEXT,
  category VARCHAR(50),
  related_tickers VARCHAR(255),
  author VARCHAR(100),
  image_url VARCHAR(255),
  active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
