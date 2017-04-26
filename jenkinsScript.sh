npm install
npm run test
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
docker-compose rm -f
docker-compose pull
docker-compose up --build -d