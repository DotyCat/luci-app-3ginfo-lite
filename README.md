# luci-app-3ginfo-lite

LuCI JavaScript interface for cellular modem information on OpenWrt.

The application displays modem identity, network mode, signal values, serving cell details, LTE/5G bands, carrier aggregation, APN, SIM information, IMEI, AT commands, cell scan, band lock and TTL settings when the installed modem profile and firmware expose those functions.

> **Compatibility note**
> The models below have a dedicated bundled profile. A profile does not guarantee every page or command will work on every firmware revision, USB composition, modem mode or OpenWrt driver.

## Supported modem profiles

### Huawei and HiLink

| Family / model             | Profile IDs or handler                             |
| -------------------------- | -------------------------------------------------- |
| Huawei E3272, E3372, E3276 | `03f0:581d`, `12d1:1506`, `12d1:155e`, `12d1:156c` |
| Huawei HiLink devices      | `modem/hilink/huawei_hilink.sh`                    |
| Alcatel HiLink devices     | `modem/hilink/alcatel_hilink.sh`                   |
| ZTE HiLink devices         | `modem/hilink/zte.sh`                              |

### Quectel

| Model / family                             | USB profile ID(s)        |
| ------------------------------------------ | ------------------------ |
| EC20-E, EC25                               | `05c6:9215`, `2c7c:0125` |
| EC200T                                     | `2c7c:6026`              |
| EP06, EG06                                 | `2c7c:0306`              |
| EM06                                       | `2c7c:030b`              |
| EG18-EA, EM12-G, EM160R-GL                 | `2c7c:0512`              |
| EM160R-GL                                  | `2c7c:0620`              |
| RG500Q-EA, RG502Q-EA, RM500Q-GL, RM502Q-AE | `2c7c:0800`              |
| RM520N-GL, RM521F-GL                       | `2c7c:0801`              |
| RM500U-CNV                                 | `2c7c:0900`              |
| RM551E-GL                                  | `2c7c:0122`, `2c7c:0133` |

### Quectel MediaTek handlers

| Model  | Handler path               |
| ------ | -------------------------- |
| RG500L | `modem/mtk/quectel/rg500l` |
| RG600L | `modem/mtk/quectel/rg600l` |
| RG620T | `modem/mtk/quectel/rg620t` |

### Fibocom

| Model / family         | USB profile ID(s)         |
| ---------------------- | ------------------------- |
| L850-GL                | `2cb7:0007`               |
| FM150-AE               | `2cb7:0104`               |
| NL952-EAU in ECM mode  | `2cb7:0105`               |
| FM350-GL               | `0e8d:7126`, `0e8d:7127`  |
| NL668-CN               | `1508:1001`               |
| L860                   | `8087:07f9`, `8087:095a`  |
| FG360 MediaTek handler | `modem/mtk/fibocom/fg360` |

### Sierra Wireless and Dell

| Model / family                                     | USB profile ID(s)                          |
| -------------------------------------------------- | ------------------------------------------ |
| Sierra Wireless 320U                               | `0f3d:68aa`                                |
| Sierra Wireless MC7710                             | `1199:68a2`                                |
| Sierra Wireless EM7355, MC7355                     | `1199:9041`                                |
| Sierra Wireless EM7455, Dell DW5809e, Dell DW5811e | `1199:9071`, `413c:81b6`                   |
| Sierra Wireless EM9190                             | `1199:90d3`                                |
| Dell DW5821e                                       | `413c:81d7`                                |
| Dell DW5930e                                       | `1e2d:00b3`, `1e2d:00b7`, PCIe `105b:e0b0` |

### Telit, Foxconn and Thales / Cinterion

| Model / family            | USB profile ID(s)                                                    |
| ------------------------- | -------------------------------------------------------------------- |
| Telit LN940, HP lt4220    | `03f0:0857`, `03f0:0a57`, `1bc7:1900`, `1bc7:1901`                   |
| Telit LN940-CP            | `1bc7:1040`                                                          |
| Telit LE910-EUG           | `1bc7:1201`                                                          |
| Foxconn T99W175           | `05c6:9025`, `05c6:90d5`, `1e2d:00b3`, `1e2d:00b7`, PCIe `105b:e0b0` |
| Thales / Cinterion MV31-W | `1e2d:00b3`, `1e2d:00b7`                                             |

### SIMCom, ZTE and other modules

| Model / family                      | USB profile ID(s)                     |
| ----------------------------------- | ------------------------------------- |
| SIMCom SIM8200EA-M2, SIM7906        | `1e0e:9000`, `1e0e:9001`, `1e0e:9003` |
| ZTE MF821                           | `19d2:0167`                           |
| ZTE MF28D, MF290                    | `19d2:0189`                           |
| ZTE P685M, ZM8630A                  | `19d2:1275`                           |
| ZTE MF286, MF286A                   | `19d2:1432`                           |
| ZTE MF286D, MF289F                  | `19d2:1485`                           |
| ZTE MF286R                          | `19d2:1489`                           |
| MikroTik R11e-LTE6                  | `2cd2:0001`, `2cd2:0004`              |
| BroadMobi BM806U, D-Link DWR-921 C1 | `2020:2033`                           |
| ASKEY WWHC050                       | `1690:7588`                           |
| YUGA CLM920-NC5                     | `05c6:9625`                           |
| Qualcomm CDMA Technologies MSM      | `05c6:6000`                           |

## How detection works

1. The application finds an AT port from `/dev/ttyUSB*`, `/dev/ttyACM*` or `/dev/wwan*at*`.

2. USB modem profiles are loaded from:

   ```text
   /usr/share/3ginfo-lite/modem/usb/<vidpid>
   ```

3. PCIe modem profiles are loaded from:

   ```text
   /usr/share/3ginfo-lite/modem/pci/<vendor><device>
   ```

4. HiLink modem/router support uses the local web API.

5. MediaTek handlers use `mipc_wan_cli` and the modem-reported manufacturer/model name.

## Runtime requirements

Core package dependencies:

* `comgt`
* `iconv`

For full modem-specific detection, the device normally requires `sms_tool`. The application uses `mipc_wan_cli`, `sms_tool`, or `gcom`, depending on which backend is available.

## Build

```sh
make package/luci-app-3ginfo-lite/{clean,compile} V=s
```

```sh
make package/luci-app-3ginfo-lite/install V=s
```

## Adding a modem profile

Create a matching lowercase VID:PID file:

```text
root/usr/share/3ginfo-lite/modem/usb/<vidpid>
```

Example:

```text
root/usr/share/3ginfo-lite/modem/usb/2c7c0125
```
