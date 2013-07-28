
LESSC = ./node_modules/.bin/lessc
LESS_FILE = ./less/sfap.less

less:
	@$(LESSC) $(LESS_FILE) > ./public/css/sfap.css

server: less
	@DEBUG=sfap ./bin/sfap server -p 4000


.PHONY: less