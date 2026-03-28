# Environment Variables Configuration

This project uses environment variables to configure the API endpoint URL for different deployment environments.

## Environment Files

- `.env.development` - Used during development (npm start)
- `.env.production` - Used during production builds (npm run build)

## Configuration

The API URL is configured using the `REACT_APP_API_URL` environment variable in `src/services/api.js`:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
```

## Deployment Instructions

### Development
The development environment is already configured to use `http://127.0.0.1:8000`.

### Production
1. Edit `.env.production` file
2. Replace `https://your-production-api-url.com` with your actual production API URL
3. Run `npm run build` to create the production build

### Alternative Deployment Methods

You can also set the environment variable directly in your deployment environment:

**Docker:**
```dockerfile
ENV REACT_APP_API_URL=https://your-production-api-url.com
```

**Kubernetes:**
```yaml
env:
- name: REACT_APP_API_URL
  value: "https://your-production-api-url.com"
```

**Heroku:**
```bash
heroku config:set REACT_APP_API_URL=https://your-production-api-url.com
```

**Netlify/Vercel:**
Set `REACT_APP_API_URL` in the environment variables section of your deployment settings.

## Important Notes

- Environment variables must start with `REACT_APP_` to be available in the React app
- After changing environment variables, you need to restart your development server or rebuild for production
- The fallback URL `http://127.0.0.1:8000` will be used if no environment variable is set
