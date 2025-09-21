# Configure the Azure Provider
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

# Create a resource group
resource "azurerm_resource_group" "main" {
  name     = "rg-exam-system-${var.environment}"
  location = var.location

  tags = {
    Environment = var.environment
    Project     = "Exam System"
  }
}

# Create a virtual network
resource "azurerm_virtual_network" "main" {
  name                = "vnet-exam-system-${var.environment}"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name

  tags = {
    Environment = var.environment
    Project     = "Exam System"
  }
}

# Create a subnet
resource "azurerm_subnet" "main" {
  name                 = "subnet-exam-system-${var.environment}"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.0.1.0/24"]
}

# Create a network security group
resource "azurerm_network_security_group" "main" {
  name                = "nsg-exam-system-${var.environment}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name

  security_rule {
    name                       = "AllowHTTP"
    priority                   = 1001
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "80"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "AllowHTTPS"
    priority                   = 1002
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "443"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "AllowSSH"
    priority                   = 1003
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "22"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  tags = {
    Environment = var.environment
    Project     = "Exam System"
  }
}

# Associate the NSG with the subnet
resource "azurerm_subnet_network_security_group_association" "main" {
  subnet_id                 = azurerm_subnet.main.id
  network_security_group_id = azurerm_network_security_group.main.id
}

# Create a public IP
resource "azurerm_public_ip" "main" {
  name                = "pip-exam-system-${var.environment}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  allocation_method   = "Static"
  sku                 = "Standard"

  tags = {
    Environment = var.environment
    Project     = "Exam System"
  }
}

# Create a network interface
resource "azurerm_network_interface" "main" {
  name                = "nic-exam-system-${var.environment}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = azurerm_subnet.main.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.main.id
  }

  tags = {
    Environment = var.environment
    Project     = "Exam System"
  }
}

# Create a virtual machine
resource "azurerm_linux_virtual_machine" "main" {
  name                = "vm-exam-system-${var.environment}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  size                = var.vm_size
  admin_username      = var.admin_username

  disable_password_authentication = true

  network_interface_ids = [
    azurerm_network_interface.main.id,
  ]

  admin_ssh_key {
    username   = var.admin_username
    public_key = var.ssh_public_key
  }

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-focal"
    sku       = "20_04-lts"
    version   = "latest"
  }

  tags = {
    Environment = var.environment
    Project     = "Exam System"
  }
}

# Create Azure SQL Server
resource "azurerm_mssql_server" "main" {
  name                         = "sql-exam-system-${var.environment}"
  resource_group_name          = azurerm_resource_group.main.name
  location                     = azurerm_resource_group.main.location
  version                      = "12.0"
  administrator_login          = var.sql_admin_username
  administrator_login_password = var.sql_admin_password
  minimum_tls_version          = "1.2"

  tags = {
    Environment = var.environment
    Project     = "Exam System"
  }
}

# Create Azure SQL Database
resource "azurerm_mssql_database" "main" {
  name           = "sqldb-exam-system-${var.environment}"
  server_id      = azurerm_mssql_server.main.id
  collation      = "SQL_Latin1_General_CP1_CI_AS"
  license_type   = "LicenseIncluded"
  max_size_gb    = 2
  sku_name       = "Basic"

  tags = {
    Environment = var.environment
    Project     = "Exam System"
  }
}

# Create Azure Storage Account
resource "azurerm_storage_account" "main" {
  name                     = "stexam${var.environment}${random_string.storage_suffix.result}"
  resource_group_name      = azurerm_resource_group.main.name
  location                 = azurerm_resource_group.main.location
  account_tier             = "Standard"
  account_replication_type = "LRS"

  tags = {
    Environment = var.environment
    Project     = "Exam System"
  }
}

# Random string for storage account name
resource "random_string" "storage_suffix" {
  length  = 8
  special = false
  upper   = false
}

# Create Azure Container Registry
resource "azurerm_container_registry" "main" {
  name                = "acrexam${var.environment}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = "Basic"
  admin_enabled       = true

  tags = {
    Environment = var.environment
    Project     = "Exam System"
  }
}

# Create Azure App Service Plan
resource "azurerm_service_plan" "main" {
  name                = "asp-exam-system-${var.environment}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  os_type             = "Linux"
  sku_name            = "B1"

  tags = {
    Environment = var.environment
    Project     = "Exam System"
  }
}

# Create Azure Web App for Backend
resource "azurerm_linux_web_app" "backend" {
  name                = "app-exam-backend-${var.environment}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  service_plan_id     = azurerm_service_plan.main.id

  site_config {
    application_stack {
      dotnet_version = "8.0"
    }
  }

  app_settings = {
    "ConnectionStrings__DefaultConnection" = "Server=${azurerm_mssql_server.main.fully_qualified_domain_name};Database=${azurerm_mssql_database.main.name};User Id=${azurerm_mssql_server.main.administrator_login};Password=${azurerm_mssql_server.main.administrator_login_password};TrustServerCertificate=true;"
    "ASPNETCORE_ENVIRONMENT" = "Production"
  }

  tags = {
    Environment = var.environment
    Project     = "Exam System"
    Component   = "Backend"
  }
}

# Create Azure Web App for Frontend
resource "azurerm_linux_web_app" "frontend" {
  name                = "app-exam-frontend-${var.environment}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  service_plan_id     = azurerm_service_plan.main.id

  site_config {
    application_stack {
      node_version = "18-lts"
    }
  }

  app_settings = {
    "REACT_APP_API_URL" = "https://${azurerm_linux_web_app.backend.default_hostname}/api"
  }

  tags = {
    Environment = var.environment
    Project     = "Exam System"
    Component   = "Frontend"
  }
}
