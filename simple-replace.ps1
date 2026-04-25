# Simple PowerShell script to replace localhost URLs
$srcDir = "src"

Get-ChildItem -Path $srcDir -Recurse -Filter *.jsx | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if ($content -match 'http://localhost:3000') {
        $content = $content -replace "'http://localhost:3000", '${API_URL}'
        $content = $content -replace '"http://localhost:3000', '${API_URL}'
        Set-Content $_.FullName $content -NoNewline
        Write-Host "Replaced in: $($_.Name)"
    }
}

Get-ChildItem -Path $srcDir -Recurse -Filter *.js | ForEach-Object {
    if (-not ($_.Name -eq 'api.js')) {
        $content = Get-Content $_.FullName -Raw
        if ($content -match 'http://localhost:3000') {
            $content = $content -replace "'http://localhost:3000", '${API_URL}'
            $content = $content -replace '"http://localhost:3000', '${API_URL}'
            Set-Content $_.FullName $content -NoNewline
            Write-Host "Replaced in: $($_.Name)"
        }
    }
}

Write-Host "`nURL replacement complete!"
Write-Host "NOTE: You still need to manually add 'import { API_URL } from '../../utils/api';' to each file that was updated"
