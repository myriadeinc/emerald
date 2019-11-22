up:
	docker-compose up
dev:
	docker build -f Dockerfile.dev -t myriade/emerald:dev .
build:
	docker build -t myriade/emerald .