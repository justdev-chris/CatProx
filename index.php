<?php
$target = "https://catsdevs.online"; // change this to your target site
$cacheDir = __DIR__ . "/cache";
if (!file_exists($cacheDir)) mkdir($cacheDir);

$requestUri = $_SERVER['REQUEST_URI'];
$cacheFile = $cacheDir . "/" . md5($requestUri) . ".html";

// check if cached file exists (valid for 5 minutes)
if (file_exists($cacheFile) && time() - filemtime($cacheFile) < 300) {
    echo file_get_contents($cacheFile);
    exit;
}

// fetch from target
$ch = curl_init($target . $requestUri);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
$response = curl_exec($ch);
$info = curl_getinfo($ch);
curl_close($ch);

// save to cache
file_put_contents($cacheFile, $response);

// fix relative URLs → make them absolute
$response = preg_replace(
    '#(href|src)=["\'](?!https?://)([^"\']+)#i',
    '$1="' . $target . '/$2',
    $response
);

// inject service worker loader
$response = str_replace(
    "</head>",
    "<script>
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }
    </script></head>",
    $response
);

header("Content-Type: text/html");
echo $response;