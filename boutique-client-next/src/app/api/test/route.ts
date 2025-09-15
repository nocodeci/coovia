import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('http://localhost:8000/api/stores');
    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      message: 'API backend accessible',
      data: data
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Erreur lors de la connexion à l\'API backend',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}
