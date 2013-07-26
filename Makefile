
LESSC = ./node_modules/.bin/lessc
LESS_FILE = ./less/sfap.less

less:
	@$(LESSC) $(LESS_FILE) > ./public/css/sfap.css

.PHONY: less