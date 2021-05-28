# Build project
npm run build

# Move to build folder
cd build

# Clone index.html -> 200.html
cp index.html 200.html

# Deploy to surge
surge . online-quiz.surge.sh
