import React, { useState } from 'react';
import { Option } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, X } from 'lucide-react';

interface VariantManagementProps {
  options: Option[];
  fetchOptions: () => void;
}

export const VariantManagement: React.FC<VariantManagementProps> = ({ options, fetchOptions }) => {
  const [newOptionName, setNewOptionName] = useState('');
  const [newOptionValueName, setNewOptionValueName] = useState('');
  const [newOptionValueColor, setNewOptionValueColor] = useState('#000000');
  const [selectedOptionForValue, setSelectedOptionForValue] = useState<string | null>(null);
  const { authFetch, token } = useAuth();

  const handleCreateOption = async () => {
    if (!newOptionName.trim()) {
      alert('Lütfen bir seçenek adı girin (örn: Aroma).');
      return;
    }
    if (!token) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await authFetch(`${apiUrl}/api/admin/options`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newOptionName }),
      });
      if (response.ok) {
        setNewOptionName('');
        await fetchOptions();
      } else {
        const errorData = await response.json();
        alert(`Seçenek oluşturulamadı: ${errorData.message || 'Bilinmeyen sunucu hatası'}`);
        console.error("Seçenek oluşturma hatası:", response.status, errorData);
      }
    } catch (error) {
      alert('Seçenek oluşturulurken bir hata oluştu.');
      console.error('Error creating option:', error);
    }
  };

  const handleDeleteOption = async (optionId: string) => {
    if (!token || !confirm('Bu seçeneği ve tüm değerlerini silmek istediğinizden emin misiniz?')) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await authFetch(`${apiUrl}/api/admin/options/${optionId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await fetchOptions();
      } else {
        const errorData = await response.json();
        alert(`Seçenek silinemedi: ${errorData.message || 'Bilinmeyen sunucu hatası'}`);
        console.error("Seçenek silme hatası:", response.status, errorData);
      }
    } catch (error) {
      alert('Seçenek silinirken bir hata oluştu.');
      console.error('Error deleting option:', error);
    }
  };

  const handleDeleteOptionValue = async (valueId: string) => {
    if (!token) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await authFetch(`${apiUrl}/api/admin/options/values/${valueId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await fetchOptions();
      } else {
        const errorData = await response.json();
        alert(`Değer silinemedi: ${errorData.message || 'Bilinmeyen sunucu hatası'}`);
        console.error("Değer silme hatası:", response.status, errorData);
      }
    } catch (error) {
      alert('Değer silinirken bir hata oluştu.');
      console.error('Error deleting option value:', error);
    }
  };

  const handleCreateOptionValue = async () => {
    if (!selectedOptionForValue) {
      alert('Lütfen hangi seçeneğe değer ekleyeceğinizi seçin.');
      return;
    }
    if (!newOptionValueName.trim()) {
      alert('Lütfen bir değer adı girin (örn: Çilek).');
      return;
    }
    try {
      const newValue = {
        value: newOptionValueName,
        optionId: selectedOptionForValue,
        ...(options.find(o => o.id === selectedOptionForValue)?.name.toLowerCase() === 'aroma' && { color: newOptionValueColor }),
      };
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await authFetch(`${apiUrl}/api/admin/options/values`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newValue),
      });
      if (response.ok) {
        fetchOptions();
        setNewOptionValueName('');
        setNewOptionValueColor('#000000');
      } else {
        const errorData = await response.json();
        alert(`Değer oluşturulamadı: ${errorData.message || 'Bilinmeyen sunucu hatası'}`);
        console.error("Değer oluşturma hatası:", response.status, errorData);
      }
    } catch (error) {
      alert('Değer oluşturulurken bir hata oluştu.');
      console.error('Failed to create option value:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seçenek Yönetimi</CardTitle>
        <CardDescription>
          Ürünlerde kullanılacak seçenekleri (Aroma, Boyut vb.) ve değerlerini buradan yönetebilirsiniz.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Mevcut Seçenekler */}
        <div className="space-y-6">
          {options.map(option => (
            <div key={option.id} className="border p-4 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">{option.name}</h3>
                <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteOption(option.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {option.values.map(value => (
                  <div key={value.id} className="border p-2 rounded-md bg-gray-50 flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      {option.name.toLowerCase() === 'aroma' && value.color && (
                        <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: value.color }}></div>
                      )}
                      <span>{value.value}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="text-red-500 h-6 w-6" onClick={() => handleDeleteOptionValue(value.id)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Yeni Seçenek Ekleme */}
        <div className="border-t pt-6">
          <h3 className="font-semibold mb-2">Yeni Seçenek Ekle</h3>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Seçenek Adı (örn: Renk)"
              value={newOptionName}
              onChange={(e) => setNewOptionName(e.target.value)}
            />
            <Button onClick={handleCreateOption}>Seçenek Ekle</Button>
          </div>
        </div>

        {/* Yeni Değer Ekleme */}
        <div className="border-t pt-6">
          <h3 className="font-semibold mb-2">Seçeneğe Yeni Değer Ekle</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <select
                className="w-full h-9 px-3 border rounded-md"
                value={selectedOptionForValue || ''}
                onChange={(e) => setSelectedOptionForValue(e.target.value)}
              >
                <option value="">Seçenek Seçin</option>
                {options.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
              <Input
                placeholder="Değer Adı (örn: Kırmızı)"
                value={newOptionValueName}
                onChange={(e) => setNewOptionValueName(e.target.value)}
              />
              {options.find(o => o.id === selectedOptionForValue)?.name.toLowerCase() === 'aroma' && (
                  <Input
                    type="color"
                    value={newOptionValueColor}
                    onChange={(e) => setNewOptionValueColor(e.target.value)}
                    className="p-1 h-10 w-14"
                  />
              )}
          </div>
            <Button onClick={handleCreateOptionValue} className="mt-2">Değer Ekle</Button>
        </div>
      </CardContent>
    </Card>
  );
};
