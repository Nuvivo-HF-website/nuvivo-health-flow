import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText } from 'lucide-react'

export default function MyFiles() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">My Files</h1>
          <p className="text-xl text-muted-foreground">
            Access your medical documents, test results, and reports
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Your Medical Files
            </CardTitle>
            <CardDescription>
              Your uploaded documents and test results will appear here
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No files yet</h3>
            <p className="text-muted-foreground">
              Upload medical documents or complete tests to see files here
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}