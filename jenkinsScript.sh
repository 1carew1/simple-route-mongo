npm install
cd simpleRoute
npm install
if [ ! -d "config" ]; then
  mkdir config
fi
cd config
cp /Users/colmcarew/Documents/Masters/Enterprise\ Web\ Dev/Assignment2/simple-route-mongo/simpleRoute/config/* .
cd ..
chmod 755 build_simpleroute.sh
./build_simpleroute.sh
cd ..
npm run test
ssh pi@pipublic -p3118 <<'ENDSSH'

cd /home/pi/simple-route-mongo
git pull
npm install
cd simpleRoute
npm install
./build_simpleroute.sh
cd ..
docker-compose rm -f
COMPOSE_HTTP_TIMEOUT=200 docker-compose pull
COMPOSE_HTTP_TIMEOUT=200 docker-compose up --build -d
COMPOSE_HTTP_TIMEOUT=200 docker-compose up -d

ENDSSH