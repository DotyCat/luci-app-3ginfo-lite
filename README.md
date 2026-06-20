# luci-app-3ginfo-lite

OpenWrt LuCI package layout:

```text
luci-app-3ginfo-lite/
├── htdocs/luci-static/     # LuCI JavaScript, CSS and images, installed below /www
├── root/                   # System payload, installed at the filesystem root
│   ├── etc/
│   └── usr/
└── Makefile
```

Build inside the OpenWrt source tree:

```sh
make package/luci-app-3ginfo-lite/{clean,compile} V=s
```

Full source-to-router mapping: see [FOLDER-MAP.md](FOLDER-MAP.md).
