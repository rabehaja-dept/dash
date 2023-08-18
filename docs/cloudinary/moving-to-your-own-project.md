# Moving to your own Cloudinary project

Each stack is initialized with access to a demo DEPT DASH™ Cloudinary project. This keeps the code from crashing when you first `npm run dev`, and reduces the number of things you have to set up immediately.

Eventually, you'll want to start using your own Cloudinary project. That means you'll need to switch over to a new project that you own.

Assuming that you already have a Cloudinary account, the process for customizing Cloudinary is changing the value of the environment variable `CLOUDINARY_CLOUD_NAME` with your own Cloudinary `Cloud Name`.
For local development, that means changing the variable in your `.envrc` file.