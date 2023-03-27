
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
	$(DK_CMP) up

build:
	$(DK_CMP) build --no-cache

clean:
	$(DK_CMP) stop

fclean: clean
	docker system prune -af --volumes ; \
	docker compose down --rmi all --volumes
re: fclean all