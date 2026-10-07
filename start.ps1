$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

function New-Hex([int]$bytes) {
    $buf = New-Object byte[] $bytes
    $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    $rng.GetBytes($buf)
    $rng.Dispose()
    -join ($buf | ForEach-Object { $_.ToString("x2") })
}

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