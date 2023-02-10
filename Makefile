
IMAGE_NAME=saiello/easy-mock-ws
IMAGE_TAG=latest

build:
	docker build -t $(IMAGE_NAME):$(IMAGE_TAG) .

publish:
	docker push $(IMAGE_NAME):$(IMAGE_TAG)
