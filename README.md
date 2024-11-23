# Table of Contents
1. [Installing a Project in Local Environment](#installing-a-project-in-local-environment)
    - [Requirements](#requirements)
        - [Docker Installation](#docker-installation)
        - [Install GNU Make](#install-gnu-make)
    - [Description of Main Environment Variables](#description-of-main-environment-variables)
    - [Project Setup](#project-setup)
2. [Configure DNS](#configure-dns)
    - [Setup Steps for Mac](#setup-steps-for-mac)
        1. [Create the `/etc/resolver` Directory](#1-create-the-etcresolver-directory)
        2. [Configure a Resolver for Your Domain](#2-configure-a-resolver-for-your-domain)
        3. [Restart `dnsmasq`](#3-restart-dnsmasq)
        4. [Test DNS Resolution](#4-test-dns-resolution)
    - [Verify DNS Configuration on macOS](#verify-dns-configuration-on-macos)
        - [Done!](#done)
    - [Setup Steps on Windows](#setup-steps-on-windows)
        1. [Configure DNS in Windows](#1-configure-dns-in-windows)
        2. [Add a Wildcard Resolver for `*.hr.saas`](#2-add-a-wildcard-resolver-for-hrsaas)
        3. [Verify DNS Setup](#3-verify-dns-setup)
    - [Advanced: Reset DNS Configuration](#advanced-reset-dns-configuration)
        - [Done!](#done-1)
3. [Connecting SSL Certificates](#connecting-ssl-certificates)
    - [Steps to Add Certificates](#steps-to-add-certificates)
4. [Finalizing Setup](#finalizing-setup)

---

## Installing a Project in Local Environment

### Requirements

- **Docker**
- **GNU Make utility**

#### Docker Installation

How to install and run Docker Desktop on Mac: [Docker Mac Installation Guide](https://docs.docker.com/desktop/install/mac-install/).

If you are using Windows - **СТРАДАЙТЕ И ЕБИТЕСЬ ПОКА ВСЕ НА ЗАРАБОТАЕТ, НОРМАЛЬНЫЙ РАЗРАБ ЮЗАЕТ MacOS!**

#### Install GNU Make

1. Open **Terminal** (located in Applications/Utilities).
2. In the terminal window, run the command:
    ```bash
    xcode-select --install
    ```
3. In the window that appears, click **Install** and agree to the **Terms of Service**.

### Description of Main Environment Variables

The primary environment variables for development are located in the `.docker/local/.env` file.

The most important variables are:

- **PROJECT_NAME=hr-saas**  
  *Name of the project.*

- **CI_REGISTRY=registry.gitlab.com**  
  *URL of the GitLab Container Registry.*

- **CI_PROJECT_PATH=p2tech/hr.saas**  
  *Path to the project's registry.*

- **PROJECT_DOMAIN=hr.saas**  
  *Primary domain through which the project will be accessible during development.*

- **ENVIRONMENT_NAME=local**  
  *Specifies the environment where the application is running, whether it's local development or production.*

**Attention!**  
When changing the `PROJECT_DOMAIN`, new certificates will be generated and placed in the `.docker/local/traefik/ssl` directory. You must then update the Traefik configuration in `.docker/local/traefik/dynamic.yml`; otherwise, the certificates will not function correctly.

### Project Setup

1. **Copy Environment Variables**  
   Run the following command to copy environment variables:
    ```bash
    make copy-envs
    ```

2. **Setup**  
   Perform any necessary setup steps as required by your project.

3. **Run Initialization Script**
    ```bash
    make init
    ```

4. **Start Service**
    ```bash
    make up
    ```

---

## Configure DNS

For local development, we are using a local DNS server that runs via Docker.

Follow this guide to automatically resolve domains and subdomains like `*.hr.saas` without editing `/etc/hosts`.

Use the domain specified in the `PROJECT_DOMAIN` variable for setting up DNS.

### Setup Steps for Mac

#### 1. Create the `/etc/resolver` Directory

The `/etc/resolver` directory is used for configuring local resolvers for specific domains.  
If it doesn't exist, create it:

```bash
sudo mkdir -p /etc/resolver
```

#### 2. Configure a Resolver for Your Domain

Create a file for your domain, e.g., `hr.saas`:

```bash
sudo nano /etc/resolver/hr.saas
```

Add the following lines to the file:

```plaintext
nameserver 127.0.0.1
port 53535
```

Save the file. This configuration will direct all requests for `*.hr.saas` to the local `dnsmasq` DNS server running on port 53535.

#### 3. Restart `dnsmasq`

If you're running `dnsmasq` in Docker, restart the service with the following commands:

```bash
docker-compose down && docker-compose up -d
```

Ensure that the `dnsmasq` service is running by checking its logs:

```bash
docker logs dnsmasq
```

#### 4. Test DNS Resolution

Use the `dig` command to verify that resolution works:

```bash
dig api.hr.saas
```

**Expected result:** The domain `api.hr.saas` should resolve to `127.0.0.1`.

### Verify DNS Configuration on macOS

To check active DNS resolvers, use the command:

```bash
scutil --dns
```

In the output, you should see a resolver for the domain `hr.saas` pointing to `127.0.0.1`.

#### Done!

Your local `dnsmasq` server now handles all requests for `*.hr.saas`, eliminating the need to manually edit `/etc/hosts`.

### Setup Steps on Windows

#### 1. Configure DNS in Windows

Windows requires custom DNS settings to redirect domain queries to the local `dnsmasq` server. Here's how to set it up:

1. **Open the Network Adapter Settings**:
    - Press `Win + R`, type `ncpa.cpl`, and hit Enter.

2. **Modify Adapter Properties**:
    - Right-click your active network adapter (e.g., Wi-Fi or Ethernet) and select **Properties**.

3. **Set a Custom DNS Server**:
    - Double-click **Internet Protocol Version 4 (TCP/IPv4)**.
    - Select **Use the following DNS server addresses**.
    - Add `127.0.0.1` as the **Preferred DNS server**.

4. **Test Connectivity**:
    - Open a Command Prompt and test if DNS queries work:
      ```bash
      nslookup hr.saas 127.0.0.1
      ```
      **Expected result:** `127.0.0.1` for `hr.saas`.

#### 2. Add a Wildcard Resolver for `*.hr.saas`

Since Windows doesn't support per-domain DNS configurations directly, you'll use a global DNS setting combined with `dnsmasq` to resolve all subdomains.

If you'd like a specific domain to be handled differently:

1. Use PowerShell or Command Prompt to test resolving the domain:
    ```bash
    nslookup subdomain.hr.saas 127.0.0.1
    ```

#### 3. Verify DNS Setup

To check if your DNS setup works:

1. Run:
    ```bash
    ping hr.saas
    ```
2. The result should resolve to `127.0.0.1`.
3. Check `dnsmasq` logs for queries:
    ```bash
    docker logs dnsmasq
    ```

### Advanced: Reset DNS Configuration

If you need to revert changes:

1. Revert DNS settings in **TCP/IPv4** properties to **Obtain DNS server address automatically**.
2. Stop the `dnsmasq` container:
    ```bash
    docker-compose down
    ```

#### Done!

Your local `dnsmasq` server now handles all requests for `*.hr.saas` domains, saving you from manually editing the `hosts` file.

---

## Connecting SSL Certificates

All necessary certificates, including root certificates (`rootCA`), are located in the `.docker/local/traefik/ssl` folder.

You need to add them to your system's key stores and mark them as trusted. The process varies depending on your operating system (macOS or Windows). Otherwise, browsers will flag the certificates as untrusted when accessing websites.

### Steps to Add Certificates

1. **Locate the Certificates:**
    - Path: `.docker/local/traefik/ssl`

2. **Add to Key Store:**
    - **macOS:**
        - Open **Keychain Access**.
        - Import the certificates.
        - Set each certificate to **"Always Trust"**.
    - **Windows:**
        - Open the **Certificates** snap-in.
        - Import the certificates into the **"Trusted Root Certification Authorities"** store.

By following these steps, you ensure that your system recognizes and trusts the SSL certificates, preventing browser warnings about untrusted certificates.

---

## Finalizing Setup

Restart services:
```bash
    make up
```
    
Now you're good to go.
