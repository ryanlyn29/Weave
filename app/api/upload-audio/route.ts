import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

/**
 * POST /api/upload-audio
 * Uploads audio file and returns URL
 * In production, this would upload to S3 or similar storage
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    // Validate file type
    if (!audioFile.type.startsWith('audio/')) {
      return NextResponse.json({ error: 'Invalid file type. Must be audio.' }, { status: 400 });
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (audioFile.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 400 });
    }

    // In production, upload to S3 or similar storage
    // For now, we'll convert to base64 and return a data URL
    // In real implementation, upload to S3 and return the S3 URL
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${audioFile.type};base64,${base64}`;

    // TODO: Replace with actual S3 upload
    // const s3Url = await uploadToS3(`audio/${Date.now()}-${audioFile.name}`, buffer, audioFile.type);
    
    return NextResponse.json({
      url: dataUrl, // Replace with s3Url in production
      filename: audioFile.name,
      size: audioFile.size,
      type: audioFile.type,
    });
  } catch (error: any) {
    console.error('Error uploading audio:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload audio' },
      { status: 500 }
    );
  }
}
