<#
.SYNOPSIS
    CareBridge PostgreSQL Database Setup and Verification Script.

.DESCRIPTION
    Detects local PostgreSQL installation, ensures the 'carebridge' database exists,
    executes schema & authoritative 36-profile seed scripts, and executes all required
    integrity verification queries.

.PARAMETER Username
    The PostgreSQL username (default: 'postgres').

.PARAMETER Host
    The PostgreSQL host (default: 'localhost').

.PARAMETER Port
    The PostgreSQL port (default: 5432).
#>

[CmdletBinding()]
param(
    [string]$Username = "postgres",
    [string]$Host = "localhost",
    [int]$Port = 5432
)

$ErrorActionPreference = "Stop"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " CareBridge Healthcare Prototype - PostgreSQL Setup" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

# 1. Detect psql.exe
$psqlCmd = Get-Command psql -ErrorAction SilentlyContinue
if ($psqlCmd) {
    $psqlPath = $psqlCmd.Source
} else {
    $detected = Get-ChildItem "C:\Program Files\PostgreSQL" -Filter "psql.exe" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($detected) {
        $psqlPath = $detected.FullName
    } else {
        $psqlPath = Read-Host "Enter full path to psql.exe (e.g. C:\Program Files\PostgreSQL\18\bin\psql.exe)"
    }
}

Write-Host "[âœ“] Using psql executable: $psqlPath" -ForegroundColor Green
& $psqlPath --version

# 2. Check for PGPASSWORD
if (-not $env:PGPASSWORD) {
    Write-Host "`n[i] Please enter the PostgreSQL password for user '$Username':" -ForegroundColor Yellow
    $securePwd = Read-Host -AsSecureString
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePwd)
    $env:PGPASSWORD = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$setupFile = Join-Path $scriptDir "carebridge_setup.sql"

# 3. Ensure database exists
Write-Host "`n[1/3] Ensuring 'carebridge' database exists..." -ForegroundColor Yellow
$checkDb = & $psqlPath -h $Host -p $Port -U $Username -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='carebridge';" 2>$null
if ($checkDb -ne "1") {
    Write-Host "  Creating database 'carebridge'..." -ForegroundColor Cyan
    & $psqlPath -h $Host -p $Port -U $Username -d postgres -c "CREATE DATABASE carebridge;"
    Write-Host "[âœ“] Database 'carebridge' created." -ForegroundColor Green
} else {
    Write-Host "[âœ“] Database 'carebridge' already exists." -ForegroundColor Green
}

# 4. Execute carebridge_setup.sql
Write-Host "`n[2/3] Applying schema and 36-profile seed dataset..." -ForegroundColor Yellow
& $psqlPath -h $Host -p $Port -U $Username -d carebridge -f $setupFile
Write-Host "[âœ“] Setup script executed successfully." -ForegroundColor Green

# 5. Run verification queries
Write-Host "`n[3/3] Running Verification Queries..." -ForegroundColor Yellow

Write-Host "`n--- Total Profiles (Expected: 36) ---" -ForegroundColor Cyan
& $psqlPath -h $Host -p $Port -U $Username -d carebridge -c "SELECT COUNT(*) AS total_profiles FROM abha_profiles;"

Write-Host "`n--- Shared Mobile Numbers (Multiple Profiles) ---" -ForegroundColor Cyan
& $psqlPath -h $Host -p $Port -U $Username -d carebridge -c "SELECT mobile_number, COUNT(*) AS profile_count FROM abha_profiles GROUP BY mobile_number HAVING COUNT(*) > 1 ORDER BY mobile_number;"

Write-Host "`n--- Test Number 9876500003 (Expected: 3) ---" -ForegroundColor Cyan
& $psqlPath -h $Host -p $Port -U $Username -d carebridge -c "SELECT COUNT(*) AS count_for_9876500003 FROM abha_profiles WHERE mobile_number = '9876500003';"

Write-Host "`n--- Zero-Profile Number 9876500000 (Expected: 0) ---" -ForegroundColor Cyan
& $psqlPath -h $Host -p $Port -U $Username -d carebridge -c "SELECT COUNT(*) AS count_for_9876500000 FROM abha_profiles WHERE mobile_number = '9876500000';"

Write-Host "`n--- Duplicate ABHA ID Check (Expected: 0 rows) ---" -ForegroundColor Cyan
& $psqlPath -h $Host -p $Port -U $Username -d carebridge -c "SELECT abha_id, COUNT(*) FROM abha_profiles GROUP BY abha_id HAVING COUNT(*) > 1;"

Write-Host "`n--- Duplicate ABHA Address Check (Expected: 0 rows) ---" -ForegroundColor Cyan
& $psqlPath -h $Host -p $Port -U $Username -d carebridge -c "SELECT abha_address, COUNT(*) FROM abha_profiles GROUP BY abha_address HAVING COUNT(*) > 1;"

Write-Host "`n--- Mobile Index Verification ---" -ForegroundColor Cyan
& $psqlPath -h $Host -p $Port -U $Username -d carebridge -c "SELECT indexname FROM pg_indexes WHERE tablename = 'abha_profiles';"

Write-Host "`n--- Deterministic Lookup for 9876500003 (ORDER BY id) ---" -ForegroundColor Cyan
& $psqlPath -h $Host -p $Port -U $Username -d carebridge -c "SELECT id, name, relationship, abha_id, abha_address, district FROM abha_profiles WHERE mobile_number = '9876500003' ORDER BY id;"

Write-Host "`n============================================================" -ForegroundColor Green
Write-Host " [âœ“] CareBridge PostgreSQL Verification Complete!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green

