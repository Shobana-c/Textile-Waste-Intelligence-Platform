# AWS EC2 Deployment Guide: Continuous Delivery (CI/CD) via GitHub Actions

This guide explains how to deploy the **TexCycle Platform** to a free-tier **AWS EC2 instance** and configure **GitHub Actions** to automatically build and run the Docker containers on every code push.

---

## 🛠️ Step 1: Launch the AWS EC2 Instance (Free Tier)

1. Sign in to your **[AWS Management Console](https://console.aws.com/)**.
2. In the top search bar, search for **`EC2`** and click it.
3. In the EC2 Dashboard, click the orange **`Launch instance`** button.
4. Configure the settings:
   * **Name:** `texcycle-server`
   * **OS Image (AMI):** Select **Ubuntu** (Ubuntu Server 24.04 LTS - **Free tier eligible**).
   * **Instance Type:** Select **`t2.micro`** (or `t3.micro` depending on availability - **Free tier eligible**).
   * **Key Pair:** Click **`Create new key pair`**:
     * Name: `texcycle-key`
     * Key pair type: `RSA`
     * Private key file format: `.pem`
     * Click **`Create key pair`** (this will download `texcycle-key.pem` to your PC. Save it safely!).
5. **Network Settings (Firewall / Security Group):**
   * Select **`Allow SSH traffic from Anywhwere`** (port 22).
   * Select **`Allow HTTP traffic from the internet`** (port 80).
   * Select **`Allow HTTPS traffic from the internet`** (port 443).
6. Click **`Launch Instance`** at the bottom right.

---

## 🔑 Step 2: Configure Ports (Security Group)
Since our frontend runs on port `3000` and the backend on port `8000`, we need to open these ports on the firewall:
1. Go to your running instance list in the EC2 Console.
2. Select your instance and click the **`Security`** tab at the bottom.
3. Click on your active **Security Group ID**.
4. Click **`Edit inbound rules`** and add these two custom TCP rules:
   * **Rule 1:** Custom TCP | Port Range: `3000` | Source: `Anywhere-IPv4` (`0.0.0.0/0`)
   * **Rule 2:** Custom TCP | Port Range: `8000` | Source: `Anywhere-IPv4` (`0.0.0.0/0`)
5. Click **`Save rules`**.

---

## 🖥️ Step 3: Connect and Install Docker
1. Go to your EC2 instance list, select your instance, and click **`Connect`** at the top.
2. Choose **`EC2 Instance Connect`** (the easiest browser-based terminal) and click **`Connect`**.
3. In the black terminal that opens, copy and paste the following commands to install **Docker** and **Docker Compose**:

```bash
# Update package list
sudo apt-get update -y

# Install Docker
sudo apt-get install -y docker.io docker-compose

# Add your user to the docker group so you don't need 'sudo' for docker commands
sudo usermod -aG docker $USER

# Close and reopen the connection for the user group changes to apply
exit
```

4. Click **`Connect`** again to reopen the terminal.

---

## 🤖 Step 4: Configure GitHub Self-Hosted Runner
Instead of managing complex secret keys, we will set up the EC2 instance as a **Self-Hosted Runner** in GitHub. This lets GitHub run the deployment commands directly on your server!

1. Go to your GitHub repository: **`https://github.com/Shobana-c/Textile-Waste-Intelligence-Platform`**.
2. Click **`Settings`** (tab at the top) ➔ **`Actions`** (in the sidebar) ➔ **`Runners`**.
3. Click the green **`New self-hosted runner`** button.
4. Select **`Linux`** as the Runner OS.
5. Under **Download** and **Configure**, copy and paste the commands shown on your GitHub page one by one into your **EC2 browser terminal**!
   *(For example: `mkdir actions-runner`, `curl`, `config.sh`, etc.)*
6. When configuring:
   * Enter the name of the runner group: press **Enter** (Default).
   * Enter the name of the runner: type `ec2-server` and press **Enter**.
   * Enter any tags: type `production` and press **Enter**.
7. Start the runner in the background:
   ```bash
   sudo ./svc.sh install
   sudo ./svc.sh start
   ```

Now, your EC2 server is listening for deployment jobs!

---

## 🔄 Step 5: Update GitHub Actions Workflow
We will configure the repository workflow file `.github/workflows/deploy.yml` to trigger on this self-hosted runner. Whenever you push code, it will build the containers directly on the VM:

```yaml
name: Continuous Delivery on EC2

on:
  push:
    branches:
      - main

jobs:
  deploy:
    name: Deploy Container platform
    runs-on: self-hosted

    steps:
    - name: Checkout Code
      uses: actions/checkout@v4

    - name: Shutdown active containers
      run: docker-compose down --remove-orphans || true

    - name: Build and start Docker platform
      run: docker-compose up --build -d
```
