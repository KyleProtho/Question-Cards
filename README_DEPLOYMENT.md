# Question Cards - Deployment Guide

This project supports two deployment approaches:

1. **Flask Backend** - Full-featured development version with server-side API
2. **Static Site** - GitHub Pages compatible version with client-side data loading

## 🚀 Quick Start

### Flask Development Server
```bash
# Run the Flask development server
./scripts/run_flask.sh
```
Then visit: http://localhost:5001

### Static Site (GitHub Pages)
```bash
# Build static version
./scripts/deploy_static.sh

# Test locally
cd deploy && python -m http.server 8000
```
Then visit: http://localhost:8000

## 📁 Project Structure

```
question_cards/
├── app.py                    # Flask application
├── all_questions.json       # Combined questions data
├── requirements.txt         # Python dependencies
├── static/                  # Static files for both versions
│   ├── index.html          # Static version HTML
│   ├── css/styles.css      # Shared styles
│   ├── js/
│   │   ├── script.js       # Flask version JavaScript
│   │   └── static-script.js # Static version JavaScript
│   └── data/
│       └── all_questions.json # Data for static version
├── templates/
│   └── index.html          # Flask template
├── scripts/
│   ├── run_flask.sh        # Start Flask development
│   └── deploy_static.sh    # Build static version
└── .github/workflows/
    └── deploy-pages.yml    # GitHub Pages deployment
```

## 🔧 Development

### Flask Version
The Flask version provides:
- Server-side API endpoints
- Dynamic data loading
- Real-time filtering
- Full development features

**To run:**
```bash
./scripts/run_flask.sh
```

**API Endpoints:**
- `GET /` - Main page
- `GET /api/questions` - All questions
- `POST /api/questions/filter` - Filter questions
- `GET /api/decks` - Available decks
- `GET /api/categories` - Available categories

### Static Version
The static version provides:
- Client-side data loading
- No server requirements
- GitHub Pages compatibility
- Same user experience

**To build:**
```bash
./scripts/deploy_static.sh
```

## 🌐 Deployment Options

### GitHub Pages (Recommended for Static)

1. **Automatic Deployment:**
   - Push to `main` branch
   - GitHub Actions will automatically deploy
   - Site will be available at `https://yourusername.github.io/question_cards`

2. **Manual Deployment:**
   ```bash
   ./scripts/deploy_static.sh
   # Copy contents of ./deploy/ to your gh-pages branch
   ```

### Other Static Hosting Services

The static version works with:
- **Netlify** - Drag and drop the `deploy/` folder
- **Vercel** - Connect your GitHub repository
- **Firebase Hosting** - Use Firebase CLI
- **AWS S3** - Upload to S3 bucket with static hosting

### Flask Hosting

For the Flask version, consider:
- **Heroku** - Easy deployment with git
- **Railway** - Modern platform with good free tier
- **Render** - Simple deployment from GitHub
- **PythonAnywhere** - Python-focused hosting
- **DigitalOcean App Platform** - Scalable hosting

## 🔄 Data Updates

When you update question data:

1. **Update source files** in `data/` directory
2. **Regenerate combined data:**
   ```bash
   python scripts/create_all_questions_json.py
   ```
3. **For static version:** The data is automatically copied during build
4. **For Flask version:** Restart the server

## 🛠️ Customization

### Adding New Question Decks

1. Add CSV files to `decks/` directory
2. Add JSON files to `data/` directory
3. Run `python scripts/create_all_questions_json.py`
4. Update deck mapping in JavaScript if needed

### Styling Changes

- Edit `static/css/styles.css` for both versions
- Changes apply to both Flask and static versions

### Feature Development

- **Flask features:** Add to `app.py` and `static/js/script.js`
- **Static features:** Add to `static/js/static-script.js`
- Keep both versions in sync for consistency

## 🐛 Troubleshooting

### Flask Version Issues
- **Port already in use:** Change port in `app.py` (line 97)
- **Missing data:** Run `python scripts/create_all_questions_json.py`
- **Dependencies:** Run `pip install -r requirements.txt`

### Static Version Issues
- **Data not loading:** Check that `static/data/all_questions.json` exists
- **CORS errors:** Ensure you're serving from a web server (not file://)
- **Build issues:** Check that `deploy_static.sh` has execute permissions

### GitHub Pages Issues
- **404 errors:** Check that `index.html` is in the root of your repository
- **Data not loading:** Ensure `data/` directory is included in deployment
- **Workflow failures:** Check GitHub Actions logs for specific errors

## 📱 Mobile Support

Both versions include:
- Responsive design
- Touch/swipe navigation
- Mobile-optimized UI
- Local storage for preferences

## 🔒 Security Notes

- **Static version:** No server-side processing, fully secure
- **Flask version:** No user input validation needed (read-only data)
- **Data:** All question data is public and safe to expose

## 📊 Performance

- **Static version:** Faster loading, no server requests
- **Flask version:** Slightly slower due to API calls
- **Data size:** ~100KB JSON file, loads quickly on both versions

## 🤝 Contributing

1. Make changes to both versions when possible
2. Test both Flask and static versions
3. Update documentation if needed
4. Ensure GitHub Actions workflow still works

## 📄 License

This project is open source. Feel free to use and modify as needed.
