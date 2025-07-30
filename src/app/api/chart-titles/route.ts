// app/api/chart-titles/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch all chart titles
export async function GET() {
  try {
    const chartTitles = await prisma.chartTitle.findMany({
      orderBy: {
        createdAt: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      data: chartTitles
    });
  } catch (error) {
    console.error('Error fetching chart titles:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch chart titles' 
      },
      { status: 500 }
    );
  }
}

// POST - Create a new chart title
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, notes } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Name is required and must be a non-empty string' 
        },
        { status: 400 }
      );
    }

    const chartTitle = await prisma.chartTitle.create({
      data: {
        name: name.trim(),
        notes: notes?.trim() || null
      }
    });

    return NextResponse.json({
      success: true,
      data: chartTitle
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating chart title:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create chart title' 
      },
      { status: 500 }
    );
  }
}