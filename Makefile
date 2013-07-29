
LESSC = ./node_modules/.bin/lessc
LESS_FILE = ./less/sfap.less


server:
	@DEBUG=sfap ./bin/sfap server -p 4000


.PHONY: