$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

function New-Hex([int]$bytes) {
    $buf = New-Object byte[] $bytes
    $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    $rng.GetBytes($buf)
    $rng.Dispose()
    -join ($buf | ForEach-Object { $_.ToString("x2") })
}

function Update-SessionPath {
    $machine = [System.Environment]::GetEnvironmentVariable("Path", "Machine")
    $user    = [System.Environment]::GetEnvironmentVariable("Path", "User")
    $env:Path = "$machine;$user"
}

function Test-DockerEngine {
    $previous = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    try {
        docker info *> $null
        return ($LASTEXITCODE -eq 0)
    } catch {
        return $false
    } finally {
        $ErrorActionPreference = $previous
    }
}

function Install-Or-UpdateDocker {
    if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
        throw "winget is not available. Install 'App Installer' from the Microsoft Store, or install Docker Desktop manually."
    }

    $dockerInstalled = [bool](Get-Command docker -ErrorAction SilentlyContinue)

    if (-not $dockerInstalled) {
        Write-Host "Docker not found. Installing Docker Desktop (includes Docker Compose)..."
        winget install -e --id Docker.DockerDesktop --accept-source-agreements --accept-package-agreements --silent
        if ($LASTEXITCODE -ne 0) { throw "Docker Desktop installation failed (exit code $LASTEXITCODE)." }
        Update-SessionPath
        if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
            throw "Docker Desktop was installed but 'docker' is not on PATH yet. A reboot or sign-out/in may be required (WSL 2 setup), then re-run this script."
        }
    }
    else {
        Write-Host "Checking for Docker Desktop updates..."
        winget upgrade -e --id Docker.DockerDesktop --accept-source-agreements --accept-package-agreements --silent
        # -1978335189 (0x8A15002B) = no applicable update, which is fine
        if ($LASTEXITCODE -ne 0 -and $LASTEXITCODE -ne -1978335189) {
            Write-Warning "Docker Desktop upgrade did not complete (exit code $LASTEXITCODE). Continuing with the installed version."
        }
        Update-SessionPath
    }
}

function Start-DockerEngine {
    if (Test-DockerEngine) { return }

    $exe = Join-Path $env:ProgramFiles "Docker\Docker\Docker Desktop.exe"
    if (-not (Test-Path $exe)) { throw "Docker Desktop executable not found at $exe" }

    Write-Host "Starting Docker Desktop..."
    Start-Process $exe

    $timeout = 180
    $elapsed = 0
    while (-not (Test-DockerEngine)) {
        if ($elapsed -ge $timeout) {
            throw "Docker engine did not become ready within $timeout seconds. Open Docker Desktop manually and accept any first-run prompts."
        }
        Start-Sleep -Seconds 3
        $elapsed += 3
    }
    Write-Host "Docker engine is ready."
}

# --- Docker install / update ---
Install-Or-UpdateDocker
Start-DockerEngine

docker compose version
if ($LASTEXITCODE -ne 0) { throw "docker compose is not available." }

# --- Project setup ---
if (-not (Test-Path "api\.env")) {
    $exemple    = Get-Content "api\.env.example" -Raw
    $motDePasse = New-Hex 16
    $cleJwt     = New-Hex 32

    $exemple = $exemple.Replace("CHANGE_ME_GENERATE_A_RANDOM_KEY", $cleJwt)
    $exemple = $exemple.Replace("CHANGE_ME", $motDePasse)

    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText("$PWD\api\.env", $exemple.TrimEnd() + "`n", $utf8NoBom)
}

docker compose up --build -d
if ($LASTEXITCODE -ne 0) { throw "docker compose failed" }

Write-Host "Opening default browser..."
Start-Process "http://localhost:5173"
