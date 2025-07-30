// app/api/chart-titles/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch a specific chart title
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const chartTitle = await prisma.chartTitle.findUnique({
      where: { id }
    });

    if (!chartTitle) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Chart title not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: chartTitle
    });
  } catch (error) {
    console.error('Error fetching chart title:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch chart title' 
      },
      { status: 500 }
    );
  }
}

// PUT - Update a chart title ONLY
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name } = body;

    // Validate input
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Name is required and must be a non-empty string' 
        },
        { status: 400 }
      );
    }

    // Update the chart title
    const updatedTitle = await prisma.chartTitle.update({
      where: { id },
      data: {
        name: name.trim(),
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedTitle
    });

  } catch (error) {
    console.error('Error updating chart title:', error);
    
    // Handle Prisma "record not found" error
    if (error === 'P2025') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Chart title not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update chart title' 
      },
      { status: 500 }
    );
  }
}