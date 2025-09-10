# Fleet Standard Smart Report Generator

AI-powered maritime inspection analysis and professional reporting tool based on Wallenius Wilhelmsen Fleet Standards.

## Features

- **PDF Upload & Analysis**: Upload SafetyCulture inspection reports for intelligent analysis
- **Fleet Standard Compliance**: Comprehensive analysis against maritime safety standards
- **Smart Scoring**: Automated scoring system across multiple categories
- **Professional Reports**: Generate detailed, professional inspection reports
- **Export Options**: Export reports in PDF and Excel formats
- **Responsive Design**: Modern, mobile-friendly web interface

## Categories Analyzed

### Safety (30% weight)
- Fire Safety
- Life Saving Equipment
- Navigation Safety
- Emergency Procedures

### Maintenance (25% weight)
- Engine Room
- Deck Equipment
- Hull Condition
- Electrical Systems

### Compliance (25% weight)
- IMO Regulations
- Flag State Requirements
- Port State Control
- Classification Society

### Environmental (20% weight)
- Pollution Prevention
- Waste Management
- Fuel Efficiency
- Environmental Compliance

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fleet-standard-smart-report
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env file with your configuration
   ```

4. **Start the application**
   ```bash
   npm start
   ```

5. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Connect your GitHub repository
4. Deploy automatically

### Railway
1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. Deploy: `railway up`

### Render
1. Go to [render.com](https://render.com)
2. Connect your GitHub repository
3. Select "Web Service"
4. Deploy automatically

## Usage

1. **Upload Inspection Report**
   - Click on the upload area or drag and drop your PDF file
   - Supported file format: PDF only
   - Maximum file size: 50MB

2. **Analyze Report**
   - Click "Analyze Report" button
   - Wait for the AI analysis to complete

3. **Review Results**
   - View overall fleet standard score
   - Examine category-wise analysis
   - Review recommendations

4. **Export Report**
   - Export as PDF for professional presentation
   - Export as Excel for data analysis
   - Start new analysis

## API Endpoints

### POST /api/analyze
Upload and analyze an inspection report PDF.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: PDF file (field name: 'inspectionReport')

**Response:**
```json
{
  "success": true,
  "data": {
    "extractedData": {
      "vesselName": "Vessel Name",
      "inspectionDate": "Date",
      "inspector": "Inspector Name",
      "findings": ["finding1", "finding2"],
      "observations": ["observation1"],
      "deficiencies": ["deficiency1"]
    },
    "analysis": {
      "safety": {
        "score": 85,
        "details": {...},
        "weight": 0.3
      }
    },
    "recommendations": [...],
    "overallScore": 82,
    "reportDate": "2025-01-09T..."
  }
}
```

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-01-09T..."
}
```

## Development

### Running in Development Mode
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

## Technology Stack

- **Backend**: Node.js, Express.js
- **PDF Processing**: pdf-parse
- **File Upload**: Multer
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Styling**: Custom CSS with Font Awesome icons

## File Structure

```
fleet-standard-smart-report/
├── public/
│   └── index.html          # Frontend application
├── uploads/                # Temporary file storage
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── env.example           # Environment variables template
└── README.md             # This file
```

## Configuration

### Environment Variables

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (development/production)
- `OPENAI_API_KEY`: OpenAI API key for enhanced analysis (optional)
- `MAX_FILE_SIZE`: Maximum file size in bytes (default: 50MB)
- `UPLOAD_DIR`: Upload directory (default: uploads)

## Error Handling

The application includes comprehensive error handling for:
- File upload errors
- PDF parsing errors
- Analysis processing errors
- Network connectivity issues

## Security Features

- File type validation (PDF only)
- File size limits
- Helmet.js security headers
- CORS protection
- Input sanitization

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions, please contact the development team or create an issue in the repository.

## Changelog

### Version 1.0.0
- Initial release
- PDF upload and analysis
- Fleet standard compliance checking
- Professional report generation
- Export functionality
