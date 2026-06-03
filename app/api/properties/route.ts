import { NextRequest, NextResponse } from 'next/server';

// Mock database
let properties: any[] = [
  {
    id: '1',
    name: 'Downtown Luxury Apartments',
    address: '123 Main St, Downtown',
    type: 'apartment',
    price: 2500000,
    occupancy: 95,
    tenants: 12,
    revenue: 45000,
    expenses: 15000,
    condition: 'excellent',
    lastInspection: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export async function GET(request: NextRequest) {
  try {
    // Add filtering, pagination, etc.
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    let filtered = properties;
    if (type) {
      filtered = properties.filter(p => p.type === type);
    }

    return NextResponse.json(filtered);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validation
    if (!body.name || !body.address || !body.type || !body.price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const property = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    properties.push(property);
    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
  }
}
