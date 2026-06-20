#!/bin/sh

find_mipc_wan_cli() {
	if [ -x /usr/bin/mipc_wan_cli ]; then
		echo /usr/bin/mipc_wan_cli
		return 0
	fi

	command -v mipc_wan_cli 2>/dev/null
}

is_uint() {
	case "$1" in
		''|*[!0-9]*)
			return 1
		;;
	esac

	return 0
}

fail() {
	echo "$1" >&2
	exit 1
}

MIPC_WAN_CLI="$(find_mipc_wan_cli)"
[ -n "$MIPC_WAN_CLI" ] || fail "mipc_wan_cli not found"

case "$1" in
	unlock)
		AT_CMD="AT+GTCELLLOCK=0"
	;;
	lock)
		rat="$2"
		type="$3"
		earfcn="$4"
		pci="$5"

		is_uint "$rat" || fail "invalid rat"
		is_uint "$type" || fail "invalid lock type"
		is_uint "$earfcn" || fail "invalid arfcn"
		[ "$earfcn" -le 4294967295 ] || fail "arfcn out of range"

		case "$rat" in
			0|1|2) ;;
			*) fail "invalid rat" ;;
		esac

		case "$type" in
			0)
				is_uint "$pci" || fail "invalid pci"
				case "$rat" in
					0)
						[ "$pci" -le 503 ] || fail "lte pci out of range"
					;;
					1)
						[ "$pci" -le 1007 ] || fail "nr pci out of range"
					;;
					*)
						fail "pci lock is only supported for LTE and NR"
					;;
				esac
				AT_CMD="AT+GTCELLLOCK=1,$rat,$type,$earfcn,$pci"
			;;
			1)
				AT_CMD="AT+GTCELLLOCK=1,$rat,$type,$earfcn"
			;;
			*)
				fail "invalid lock type"
			;;
		esac
	;;
	*)
		fail "usage: $0 unlock | lock <rat> <type> <arfcn> [pci]"
	;;
esac

"$MIPC_WAN_CLI" --at_cmd "$AT_CMD"
