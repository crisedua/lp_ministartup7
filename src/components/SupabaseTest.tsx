import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export const SupabaseTest = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    setIsLoading(true);
    setTestResult('Testing connection...');
    
    try {
      // Test 1: Check if we can connect to Supabase
      const { data, error } = await supabase
        .from('signups')
        .select('count(*)')
        .limit(1);
      
      if (error) {
        setTestResult(`❌ Error: ${error.message}`);
        console.error('Supabase error:', error);
        return;
      }
      
      setTestResult('✅ Connection successful! Table exists and is accessible.');
      
    } catch (error) {
      setTestResult(`❌ Connection failed: ${error}`);
      console.error('Connection error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testInsert = async () => {
    setIsLoading(true);
    setTestResult('Testing insert...');
    
    try {
      const testData = {
        name: 'Test User',
        email: 'test@example.com',
        event: 'Test Event',
        date: '2025-01-01T12:00:00-04:00',
        timestamp: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('signups')
        .insert([testData])
        .select();
      
      if (error) {
        setTestResult(`❌ Insert Error: ${error.message}`);
        console.error('Insert error:', error);
        return;
      }
      
      setTestResult(`✅ Insert successful! Data: ${JSON.stringify(data, null, 2)}`);
      
    } catch (error) {
      setTestResult(`❌ Insert failed: ${error}`);
      console.error('Insert error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const viewData = async () => {
    setIsLoading(true);
    setTestResult('Fetching data...');
    
    try {
      const { data, error } = await supabase
        .from('signups')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) {
        setTestResult(`❌ Fetch Error: ${error.message}`);
        console.error('Fetch error:', error);
        return;
      }
      
      setTestResult(`✅ Data fetched! Records: ${JSON.stringify(data, null, 2)}`);
      
    } catch (error) {
      setTestResult(`❌ Fetch failed: ${error}`);
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border-2 border-gray-200 max-w-md">
      <h3 className="font-bold text-lg mb-4">🔧 Supabase Test Panel</h3>
      
      <div className="space-y-2 mb-4">
        <button
          onClick={testConnection}
          disabled={isLoading}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Test Connection
        </button>
        
        <button
          onClick={testInsert}
          disabled={isLoading}
          className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          Test Insert
        </button>
        
        <button
          onClick={viewData}
          disabled={isLoading}
          className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
        >
          View Recent Data
        </button>
      </div>
      
      {testResult && (
        <div className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-40">
          <pre className="whitespace-pre-wrap">{testResult}</pre>
        </div>
      )}
    </div>
  );
}; 