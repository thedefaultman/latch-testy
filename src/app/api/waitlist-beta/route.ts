import { NextRequest, NextResponse } from 'next/server';
  import { createClient } from '@supabase/supabase-js';

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createClient(supabaseUrl, supabaseKey);

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

      // Generate unique ID
      const id = crypto.randomUUID();

      // Insert into Supabase
      const { data, error } = await supabase
        .from('Waitlist')
        .insert([
          {
            id,
            name,
            email,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ])
        .select();

      if (error) {
        // Handle duplicate email error
        if (error.code === '23505') {
          return NextResponse.json(
            { error: 'Email already registered' },
            { status: 409 }
          );
        }

        console.error('Supabase error:', error);
        return NextResponse.json(
          { error: 'Failed to add to waitlist' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: 'Successfully added to beta waitlist',
        success: true,
        id: data[0]?.id
      });

    } catch (error) {
      console.error('Beta waitlist submission error:', error);
      return NextResponse.json(
        { error: 'Failed to add to waitlist' },
        { status: 500 }
      );
    }
  }