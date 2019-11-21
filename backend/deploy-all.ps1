$curDir = Get-Location
$childDirs = dir $curDir | ?{$_.PSISContainer}

foreach ($d in $dirs) {
    $curDir
    #if ($dir -eq 'iot') { continnue }
    #echo $dir
}

echo 'lalala'
