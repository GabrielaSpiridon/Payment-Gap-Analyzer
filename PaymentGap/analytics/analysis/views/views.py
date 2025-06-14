from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework import status
import pandas as pd
import MySQLdb

from analysis.handlers import handler_map

@api_view(['POST'])
@parser_classes([MultiPartParser])
def upload_excel(request):

    if 'file' not in request.FILES:
        return Response({'error': 'Fisierul nu a fost trimis.'}, status=status.HTTP_400_BAD_REQUEST)

    files = request.FILES.getlist('file')
    total_inserted = 0
    imported_tables = []

    try:
        conn = MySQLdb.connect(
            host="localhost",
            user="root",
            passwd="gabriela2003",
            db="payment_gap_db",
        )
        cursor = conn.cursor()

        for file_obj in files:
            table_name = file_obj._name.split('.')[0].lower()
            df = pd.read_excel(file_obj)

            if table_name in handler_map:
                try:
                    inserted = handler_map[table_name](df, cursor)
                    imported_tables.append(table_name)
                    total_inserted += inserted
                except Exception as e:
                    print(f"Eroare la inserția în {table_name}: {e}")
                    continue
            else:
                print(f"Tabelul {table_name} nu este suportat. Verifica handler_map.")
                continue

        if total_inserted > 0:
            conn.commit()
            response_data = {
                'message': 'Fisiere importate cu succes.',
                'tables': imported_tables,
                'total_rows': total_inserted
            }
            status_code = status.HTTP_200_OK
        else:
            conn.rollback()
            response_data = {'error': 'Niciun fisier nu a fost importat corect.'}
            status_code = status.HTTP_400_BAD_REQUEST

        cursor.close()
        conn.close()
        return Response(response_data, status=status_code)

    except Exception as e:
        return Response({'error': f'Eroare la procesare: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
