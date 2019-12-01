
T = $(TAG)

dev:
	docker build -f Dockerfile.dev -t myriadeinc/emerald:dev .

up:
	docker-compose up

build: 
	docker build -f Dockerfile -t myriadeinc/emerald:${T} .
