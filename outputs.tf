output "resource_group_name" {
  description = "Name of the resource group"
  value       = azurerm_resource_group.main.name
}

output "resource_group_location" {
  description = "Location of the resource group"
  value       = azurerm_resource_group.main.location
}

output "virtual_machine_public_ip" {
  description = "Public IP address of the virtual machine"
  value       = azurerm_public_ip.main.ip_address
}

output "virtual_machine_fqdn" {
  description = "Fully qualified domain name of the virtual machine"
  value       = azurerm_public_ip.main.fqdn
}

output "sql_server_fqdn" {
  description = "Fully qualified domain name of the SQL Server"
  value       = azurerm_mssql_server.main.fully_qualified_domain_name
}

output "sql_database_name" {
  description = "Name of the SQL Database"
  value       = azurerm_mssql_database.main.name
}

output "storage_account_name" {
  description = "Name of the storage account"
  value       = azurerm_storage_account.main.name
}

output "container_registry_login_server" {
  description = "Login server of the container registry"
  value       = azurerm_container_registry.main.login_server
}

output "backend_app_url" {
  description = "URL of the backend web app"
  value       = "https://${azurerm_linux_web_app.backend.default_hostname}"
}

output "frontend_app_url" {
  description = "URL of the frontend web app"
  value       = "https://${azurerm_linux_web_app.frontend.default_hostname}"
}

output "connection_string" {
  description = "SQL Server connection string"
  value       = "Server=${azurerm_mssql_server.main.fully_qualified_domain_name};Database=${azurerm_mssql_database.main.name};User Id=${azurerm_mssql_server.main.administrator_login};Password=${azurerm_mssql_server.main.administrator_login_password};TrustServerCertificate=true;"
  sensitive   = true
}
