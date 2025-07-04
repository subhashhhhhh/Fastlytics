import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Coffee, X, Server, TrendingUp } from 'lucide-react';

interface KofiDonationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const KofiDonationPopup: React.FC<KofiDonationPopupProps> = ({ isOpen, onClose }) => {
  const handleKofiClick = () => {
    window.open('https://ko-fi.com/fastlytics', '_blank');
    onClose();
  };

  const handleRemindLater = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Heart className="h-5 w-5 text-red-500" />
            Support Fastlytics
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Help us keep the servers running and the data flowing!
          </DialogDescription>
        </DialogHeader>
        
        <Card className="bg-gray-800/50 border-gray-700 overflow-hidden">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Ko-fi branded section */}
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300">
                  <Coffee className="h-4 w-4 text-white" />
                  <span className="text-sm font-medium text-white">Ko-fi</span>
                </div>
                
                <h3 className="text-lg font-semibold text-white">
                  Buy us a coffee? ☕
                </h3>
                
                <p className="text-sm text-gray-300 leading-relaxed">
                  F1 analytics require expensive server resources and our previous donations have been exhausted. Your support helps us:
                </p>
                
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Server className="h-4 w-4 text-blue-400" />
                    <span>Cover server costs</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    <span>Improve performance</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-3 pt-4">
                <Button 
                  onClick={handleKofiClick}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2.5 transition-all duration-200 transform hover:scale-105"
                >
                  <Coffee className="h-4 w-4 mr-2" />
                  Support on Ko-fi
                </Button>
                
                <Button 
                  onClick={handleRemindLater}
                  variant="outline" 
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white text-sm"
                >
                  Remind me later
                </Button>
              </div>
              
              {/* Small disclaimer */}
              <p className="text-xs text-gray-500 text-center pt-2">
                100% of donations go towards server costs and development
              </p>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default KofiDonationPopup;
