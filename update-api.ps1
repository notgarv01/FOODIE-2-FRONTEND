# PowerShell script to update all frontend files to use API_URL
$srcDir = "src"

function Get-RelativePath($from, $to) {
    $from = Resolve-Path $from
    $to = Resolve-Path $to
    $fromUri = New-Object Uri -ArgumentList $from
    $toUri = New-Object Uri -ArgumentList $to
    $relative = $fromUri.MakeRelativeUri($toUri)
    $relative -replace '\\', '/' -replace '\.js$|\.jsx$', ''
}

function Update-File($filePath) {
    $content = Get-Content $filePath -Raw
    
    # Skip if already has import
    if ($content -match "import \{ API_URL \}") {
        Write-Host "Skipped (already has import): $filePath"
        return
    }
    
    # Skip if no localhost:3000 references
    if ($content -notmatch 'http://localhost:3000') {
        Write-Host "Skipped (no localhost): $filePath"
        return
    }
    
    $apiUtilsPath = Join-Path $srcDir "utils\api.js"
    $relativePath = Get-RelativePath (Split-Path $filePath) $apiUtilsPath
    
    # Add import after the last import statement
    $lines = $content -split '\r?\n'
    $lastImportIndex = -1
    
    for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -match '^import ') {
            $lastImportIndex = $i
        }
    }
    
    if ($lastImportIndex -ge 0) {
        $lines[$lastImportIndex + 1] = $lines[$lastImportIndex + 1] -replace '^', "import { API_URL } from '$relativePath';`n"
    } else {
        $lines[0] = "import { API_URL } from '$relativePath';`n" + $lines[0]
    }
    
    $content = $lines -join "`r`n"
    
    # Replace all http://localhost:3000 with ${API_URL}
    $content = $content -replace "'http://localhost:3000", '${API_URL}'
    $content = $content -replace '"http://localhost:3000', '${API_URL}'
    
    Set-Content $filePath $content -NoNewline
    Write-Host "Updated: $filePath"
}

Get-ChildItem -Path $srcDir -Recurse -Filter *.jsx | ForEach-Object {
    if (-not ($_.Name -eq 'api.js')) {
        Update-File $_.FullName
    }
}

Get-ChildItem -Path $srcDir -Recurse -Filter *.js | ForEach-Object {
    if (-not ($_.Name -eq 'api.js')) {
        Update-File $_.FullName
    }
}

Write-Host "`nBatch update complete!"
