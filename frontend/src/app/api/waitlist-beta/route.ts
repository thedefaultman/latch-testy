import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json();

    // Basic validation
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // For beta launch, we'll just log to Vercel logs
    // Later you can connect this to your actual database
    console.log('Beta waitlist submission:', { name, email, timestamp: new Date().toISOString() });

    // You can also send this to an external service like:
    // - Airtable
    // - Google Sheets
    // - EmailOctopus
    // - ConvertKit
    // For now, we'll just return success

    return NextResponse.json({
      message: 'Successfully added to beta waitlist',
      success: true
    });

  } catch (error) {
    console.error('Beta waitlist submission error:', error);
    return NextResponse.json(
      { error: 'Failed to add to waitlist' },
      { status: 500 }
    );
  }
}