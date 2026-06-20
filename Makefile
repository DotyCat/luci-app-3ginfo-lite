include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-3ginfo-lite
PKG_VERSION:=1.0.75
PKG_RELEASE:=20250505

PKG_LICENSE:=GPL-2.0
PKGARCH:=all

include $(INCLUDE_DIR)/package.mk

define Package/luci-app-3ginfo-lite
  SECTION:=luci
  CATEGORY:=LuCI
  SUBMENU:=3. Applications
  TITLE:=LuCI JS interface for 3ginfo-lite
  DEPENDS:=+comgt +iconv
  PKGARCH:=all
endef

define Package/luci-app-3ginfo-lite/description
 LuCI JS interface for 3ginfo-lite.
 Displays cellular modem information, signal data, bands,
 cell details, APN, IMEI, SIM and TTL settings.
endef

define Build/Compile
endef

define Package/luci-app-3ginfo-lite/install
	$(CP) ./files/* $(1)/
endef

$(eval $(call BuildPackage,luci-app-3ginfo-lite))
