
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
