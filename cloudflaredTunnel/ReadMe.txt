Cloudflare tunnel futtatása:

Nyisd meg a config.yml fájlt, és állítsd át a "credentials" fájl helyét a saját "credentials" fájlod elérési útvonalára.

Miután ezzel megvagy, navigálj a mappába amely tartalmazza a cloudflared.exe fájlt és nyiss egy cmd-t.
és írd be ezt:

cloudflared tunnel --config "config.yml fájl teljes elérési útvonala" run "tunnel id-ja"

cloudflared tunnel --config "C:\Users\USER\Documents\GitHub\NextRest\cloudflaredTunnel\config.yml" run 4f11b129-9ade-40b5-95d0-f395bdd48857