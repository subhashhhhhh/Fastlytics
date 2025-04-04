import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Gauge } from "lucide-react"
import React from "react"
import { toPng } from "html-to-image"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Exports a DOM element (chart) as a PNG image with Fastlytics branding
 * @param elementRef - React ref to the DOM element to export
 * @param filename - Name for the downloaded file (without extension)
 */
export async function exportChartAsImage(
  elementRef: React.RefObject<HTMLElement>,
  filename: string = "fastlytics-chart"
): Promise<void> {
  if (!elementRef.current) {
    console.error("No element ref provided for chart export");
    return;
  }

  try {
    // Create a clone of the element to avoid modifying the original
    const originalElement = elementRef.current;
    
    // Wait a moment to ensure chart is fully rendered
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Use the original element with all SVG intact rather than cloning
    // Add some custom styles just for the export
    const originalStyles = {
      position: originalElement.style.position,
      background: originalElement.style.background,
      padding: originalElement.style.padding,
      borderRadius: originalElement.style.borderRadius,
      overflow: originalElement.style.overflow
    };
    
    // Add export styles
    originalElement.style.background = '#111827';
    originalElement.style.borderRadius = '8px';
    originalElement.style.overflow = 'visible';
    
    // Reduce padding to create less space between elements
    originalElement.style.padding = '8px 8px 12px 8px';
    
    // Fix title display for export
    const cardHeader = originalElement.querySelector('div[class*="CardHeader"]');
    const chartTitle = originalElement.querySelector('h3[class*="CardTitle"]');
    
    if (chartTitle && cardHeader) {
      // Clone the title to ensure it doesn't get affected by layout issues
      const titleText = chartTitle.textContent || '';
      
      if (titleText) {
        // Create a dedicated title element for the export
        const exportTitle = document.createElement('div');
        exportTitle.style.fontWeight = 'bold';
        exportTitle.style.fontSize = '18px';
        exportTitle.style.color = 'white';
        exportTitle.style.marginBottom = '5px'; // Minimal margin
        exportTitle.style.textAlign = 'center';
        exportTitle.style.width = '100%';
        exportTitle.style.paddingTop = '8px';
        exportTitle.textContent = titleText;
        
        // Hide the original header
        (cardHeader as HTMLElement).style.display = 'none';
        
        // Insert the new title at the top
        if (originalElement.firstChild) {
          originalElement.insertBefore(exportTitle, originalElement.firstChild);
        } else {
          originalElement.appendChild(exportTitle);
        }
      }
    }
    
    // Find the chart container and reduce top margin
    const chartContainer = originalElement.querySelector('.recharts-responsive-container');
    if (chartContainer) {
      (chartContainer as HTMLElement).style.marginTop = '0px'; // No additional margin
    }
    
    // Find any title element and ensure it doesn't overlap
    const title = originalElement.querySelector('.text-lg.font-semibold');
    if (title) {
      (title as HTMLElement).style.marginBottom = '5px'; // Minimal margin
      (title as HTMLElement).style.whiteSpace = 'nowrap';
    }
    
    // Find buttons and temporarily hide them
    const buttons = originalElement.querySelectorAll('button');
    const buttonDisplayStyles: string[] = [];
    buttons.forEach(button => {
      buttonDisplayStyles.push(button.style.display);
      button.style.display = 'none';
    });
    
    // Create and add branding container
    const brandingDiv = document.createElement('div');
    brandingDiv.style.position = 'absolute';
    brandingDiv.style.bottom = '15px'; // Position at bottom instead of top
    brandingDiv.style.right = '20px';
    brandingDiv.style.display = 'flex';
    brandingDiv.style.alignItems = 'center';
    brandingDiv.style.gap = '6px';
    brandingDiv.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';
    brandingDiv.style.fontSize = '16px';
    brandingDiv.style.letterSpacing = '-0.02em';
    brandingDiv.style.color = 'white';
    brandingDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    brandingDiv.style.padding = '6px 12px';
    brandingDiv.style.borderRadius = '4px';
    brandingDiv.style.zIndex = '9999';
    
    // Create gauge icon
    const gaugeIcon = document.createElement('span');
    gaugeIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-gauge" style="color: #ef4444;"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>`;
    
    // Create Fastlytics text
    const fastlyticsText = document.createElement('span');
    fastlyticsText.innerHTML = '<span style="color: white; font-weight: 600; letter-spacing: -0.02em;">Fast</span><span style="color: #ef4444; font-weight: 600; letter-spacing: -0.02em;">lytics</span>';
    
    // Assemble branding
    brandingDiv.appendChild(gaugeIcon);
    brandingDiv.appendChild(fastlyticsText);
    
    // Add branding to original element
    originalElement.appendChild(brandingDiv);
    
    // Convert to image, setting quality and resolution
    const dataUrl = await toPng(originalElement, {
      quality: 0.98,
      pixelRatio: 2,
      backgroundColor: '#111827',
      cacheBust: true,
      skipFonts: true,
      fontEmbedCSS: '',
      filter: (node) => {
        return true; // Include all nodes
      },
      width: originalElement.offsetWidth,
      height: originalElement.offsetHeight,
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left'
      },
      canvasWidth: originalElement.offsetWidth,
      canvasHeight: originalElement.offsetHeight
    });
    
    // Clean up - restore original styles
    originalElement.style.position = originalStyles.position;
    originalElement.style.background = originalStyles.background;
    originalElement.style.padding = originalStyles.padding;
    originalElement.style.borderRadius = originalStyles.borderRadius;
    originalElement.style.overflow = originalStyles.overflow;
    
    // Restore button visibility
    buttons.forEach((button, index) => {
      button.style.display = buttonDisplayStyles[index];
    });
    
    // Remove branding
    if (originalElement.contains(brandingDiv)) {
      originalElement.removeChild(brandingDiv);
    }
    
    // Create download link
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = dataUrl;
    link.click();
    
  } catch (error) {
    console.error('Error exporting chart as image:', error);
    
    // Show user-visible error alert
    if (typeof window !== 'undefined') {
      alert('Failed to export chart. Please try again later.');
    }
  }
}
