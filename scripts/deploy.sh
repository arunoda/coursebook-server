if [[ -z $ADMIN_TOKEN ]]; then
  echo "Expose the ADMIN_TOKEN"
  exit 1
fi

now \
  -a coursebook-server \
  -e GITHUB_CLIENT_ID=@coursebook-gh-client-id \
  -e GITHUB_CLIENT_SECRET=@coursebook-gh-client-secret \
  -e ROOT_URL="https://coursebook-server.now.sh" \
  -e MONGO_URL=@coursebook-mongo-url \
  -e ADMIN_TOKEN=$ADMIN_TOKEN
