Add-Type -AssemblyName System.Drawing
$files = Get-ChildItem "c:\Users\ADMIN\Desktop\appjeweryshop\myApp\assets\images\products\*"
foreach ($f in $files) {
    $img = [System.Drawing.Image]::FromFile($f.FullName)
    Write-Output "$($f.Name): $($img.Width)x$($img.Height)"
    $img.Dispose()
}
