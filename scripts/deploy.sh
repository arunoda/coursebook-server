if [[ -z $ADMIN_TOKEN ]]; then
  echo "Expose the ADMIN_TOKEN"
  exit 1
fi

now \
  -a server.learnnextjs.com \
  -e GITHUB_CLIENT_ID=@learnnextjs-gh-client-id \
  -e GITHUB_CLIENT_SECRET=@learnnextjs-gh-client-secret \
  -e ROOT_URL="https://server.learnnextjs.com" \
  -e MONGO_URL=@learnnextjs-mongo-url \
  -e ADMIN_TOKEN=$ADMIN_TOKEN
