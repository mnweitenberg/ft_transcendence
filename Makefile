
NAME = pong

SRCS = docker-compose.yml

UNAME := $(shell uname)
ifeq ($(UNAME), Linux)
  DK_CMP = docker-compose
else
  DK_CMP = docker compose
endif

$(NAME): all

all:
	$(DK_CMP) up -d --build

build:
	$(DK_CMP) build --no-cache

clean:
	$(DK_CMP) down

fclean: clean
	docker system prune -af --volumes ; \
	$(DK_CMP) down --rmi all --volumes

re: fclean all

restart:
	$(DK_CMP) down
	$(DK_CMP) build
	$(DK_CMP) up -d

logs:
	@ptyexec $$(which $(word 1,$(DK_CMP))) $(wordlist 2, $(words $(DK_CMP)),$(DK_CMP)) logs | sed $$'s/\x1bc//g'
# ptyexec is used to keep the colors in the logs
# the sed command removes the clear screen

logs_follow:
	@ptyexec $$(which $(word 1,$(DK_CMP))) $(wordlist 2, $(words $(DK_CMP)),$(DK_CMP)) logs -f | sed $$'s/\x1bc//g'
# ptyexec is used to keep the colors in the logs
# the sed command removes the clear screen

.PHONY: all build clean fclean re restart logs logs_follow
