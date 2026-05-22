# three-tier-eks-cluster

<img width="1855" height="1065" alt="image" src="https://github.com/user-attachments/assets/a11563b7-9e68-48f5-bb65-63d0e00393ac" />



<img width="1911" height="782" alt="image" src="https://github.com/user-attachments/assets/3eeecbd6-6f99-490f-82ab-fe5e8b1f229c" />

open anothe rterminal and check for backend api is running
<img width="1130" height="282" alt="image" src="https://github.com/user-attachments/assets/456e401b-2d6c-4825-82d0-ad968af625e6" />


create docker image using dockerfile for backend:
<img width="1900" height="1022" alt="image" src="https://github.com/user-attachments/assets/d0750f71-4f5f-4442-8f82-742b6afaa305" />

verify docker image using:
<img width="1910" height="353" alt="image" src="https://github.com/user-attachments/assets/c66e2aa6-49d6-45e5-86cc-c52da2cecece" />

run the conatiner for backend and test containerized backend:
<img width="1905" height="405" alt="image" src="https://github.com/user-attachments/assets/e755d013-957b-4212-876c-e32cbf9d9863" />

now go to frontend folder:
<img width="1253" height="988" alt="image" src="https://github.com/user-attachments/assets/c5c38728-e783-4841-b2be-c262110069b9" />

this will open browser and it should show:
<img width="1680" height="665" alt="image" src="https://github.com/user-attachments/assets/9017b837-872b-445e-9cd6-d5fa9d301fc3" />

craete dockerfile for frontend:
```
FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```


build the frontend application and create docke rimage:
<img width="1905" height="707" alt="image" src="https://github.com/user-attachments/assets/73b11d0d-9b61-4732-93e8-e8a543564814" />

now run the conatiner frontend:
<img width="1614" height="277" alt="image" src="https://github.com/user-attachments/assets/010b1496-a27d-4e4c-ab07-35c05ee5eaa2" />

open application on browser:
```
http://localhost:3000
```
<img width="1909" height="616" alt="image" src="https://github.com/user-attachments/assets/2d58ab9f-6359-40ed-828e-4223c1832c2f" />

pull mysql image
```
- docker pull mysql:8
```
creat mysql volume
```
- docker volume create mysql-data
```
run mysql container:
```
docker run -d --name mysql-container --network three-tier-network -v mysql-data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=password123 -e MYSQL_DATABASE=three_tier_db -p 3306:3306 mysql:8
```
mysql container is running:
<img width="1769" height="369" alt="image" src="https://github.com/user-attachments/assets/7910d02b-4774-48aa-b69b-1abed990e18a" />

check three containers are in same network:
```
- docker network inspect three-tier-network
```
<img width="1074" height="955" alt="image" src="https://github.com/user-attachments/assets/67e5a964-54eb-4eb3-b83c-25b1ee36370a" />

test backend:
```
-curl http://localhost:8085
```
<img width="1298" height="311" alt="image" src="https://github.com/user-attachments/assets/da3a1a38-e6c7-4e40-8120-47567a6c2ffc" />

test full application:
```
- http://localhost:3000
```
<img width="1859" height="337" alt="image" src="https://github.com/user-attachments/assets/69b45b83-ecdc-44fc-b50f-50138f4029cc" />

craete ECR repository for backend and fronend:
```
- aws ecr create-repository --repository-name backend-repo --region ap-south-1
- aws ecr create-repository --repository-name frontend-repo --region ap-south-1
```
 Login to ECR:
 ```
- aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin <YOUR_ACCOUNT_ID>.dkr.ecr.apsouth1.amazonaws.com
```
TAG BACKEND AND FRONTEND IMAGE:
```
-docker tag backend-app:v1 <ACCOUNT-ID>.dkr.ecr.ap-south-1.amazonaws.com/backend-repo:v1
- docker tag frontend-app:v1 <ACCOUNT-ID>.dkr.ecr.ap-south-1.amazonaws.com/frontend-repo:v1
```
PUSH TO ECR
```
- docker push <ACCOUNT-ID>.dkr.ecr.ap-south-1.amazonaws.com/backend-repo:v1
- docker push <ACCOUNT-ID>.dkr.ecr.ap-south-1.amazonaws.com/frontend-repo:v1
- 
```

apply frontend, backend , mysql deployment service,

then try to access the loadbalcnder external ip in browser:

<img width="1787" height="648" alt="image" src="https://github.com/user-attachments/assets/9575b3a2-3a76-492c-aa97-03b3f225e322" />
